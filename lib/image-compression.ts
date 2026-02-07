import sharp from 'sharp';

/**
 * 이미지 압축 옵션
 */
interface CompressionOptions {
  maxSizeBytes?: number; // 최대 목표 크기 (기본: 0.5MB)
  quality?: number; // 초기 품질 (기본: 80)
}

/**
 * 이미지 압축 결과
 */
interface CompressionResult {
  buffer: Buffer;
  mimeType: string;
  originalSize: number;
  compressedSize: number;
}

/**
 * 이미지를 압축합니다.
 * 1MB 이상의 이미지를 약 0.5MB로 압축합니다.
 */
export async function compressImage(
  imageBuffer: Buffer,
  originalMimeType: string,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const { maxSizeBytes = 524288, quality = 80 } = options; // 0.5MB 기본값
  const originalSize = imageBuffer.length;

  // 1MB 미만이면 압축하지 않음
  if (originalSize < 1048576) {
    return {
      buffer: imageBuffer,
      mimeType: originalMimeType,
      originalSize,
      compressedSize: originalSize,
    };
  }

  try {
    let compressedBuffer: Buffer;
    let currentQuality = quality;
    let mimeType = 'image/webp'; // WebP로 변환하여 더 나은 압축률 제공

    // Sharp 인스턴스 생성
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();

    // 이미지 크기 계산 (리사이징이 필요한 경우 대비)
    let targetWidth = metadata.width;
    let targetHeight = metadata.height;

    // 첫 번째 시도: WebP로 변환 + 품질 조정
    compressedBuffer = await image
      .webp({ quality: currentQuality })
      .toBuffer();

    // 목표 크기에 도달할 때까지 품질 낮추기
    while (compressedBuffer.length > maxSizeBytes && currentQuality > 20) {
      currentQuality -= 10;
      compressedBuffer = await sharp(imageBuffer)
        .webp({ quality: currentQuality })
        .toBuffer();
    }

    // 여전히 크면 리사이징
    if (compressedBuffer.length > maxSizeBytes && targetWidth && targetHeight) {
      const scale = 0.8; // 80%로 축소
      targetWidth = Math.floor(targetWidth * scale);
      targetHeight = Math.floor(targetHeight * scale);

      compressedBuffer = await sharp(imageBuffer)
        .resize(targetWidth, targetHeight, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: currentQuality })
        .toBuffer();

      // 여전히 크면 추가 리사이징
      while (compressedBuffer.length > maxSizeBytes && targetWidth > 400) {
        targetWidth = Math.floor(targetWidth * 0.8);
        targetHeight = Math.floor(targetHeight * 0.8);

        compressedBuffer = await sharp(imageBuffer)
          .resize(targetWidth, targetHeight, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality: Math.max(currentQuality, 60) })
          .toBuffer();
      }
    }

    const compressedSize = compressedBuffer.length;

    console.log(
      `이미지 압축 완료: ${(originalSize / 1024 / 1024).toFixed(2)}MB -> ${(
        compressedSize /
        1024 /
        1024
      ).toFixed(2)}MB (${((compressedSize / originalSize) * 100).toFixed(1)}%)`
    );

    return {
      buffer: compressedBuffer,
      mimeType,
      originalSize,
      compressedSize,
    };
  } catch (error) {
    console.error('이미지 압축 오류:', error);
    // 압축 실패 시 원본 반환
    return {
      buffer: imageBuffer,
      mimeType: originalMimeType,
      originalSize,
      compressedSize: originalSize,
    };
  }
}
