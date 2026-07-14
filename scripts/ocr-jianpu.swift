import AppKit
import Foundation
import Vision

struct OCRItem: Codable {
  let text: String
  let confidence: Float
  let x: Double
  let y: Double
  let width: Double
  let height: Double
}

guard CommandLine.arguments.count > 1 else {
  fputs("Usage: ocr-jianpu.swift <image>\n", stderr)
  exit(2)
}

let imagePath = CommandLine.arguments[1]
guard
  let image = NSImage(contentsOfFile: imagePath),
  let imageData = image.tiffRepresentation,
  let bitmap = NSBitmapImageRep(data: imageData),
  let cgImage = bitmap.cgImage
else {
  fputs("Unable to load image\n", stderr)
  exit(1)
}

let request = VNRecognizeTextRequest()
request.recognitionLevel = .accurate
request.recognitionLanguages = ["zh-Hans", "en-US"]
request.usesLanguageCorrection = false
request.minimumTextHeight = 0.004

let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
try handler.perform([request])

let items = (request.results ?? []).compactMap { observation -> OCRItem? in
  guard let candidate = observation.topCandidates(1).first else { return nil }
  let box = observation.boundingBox
  return OCRItem(
    text: candidate.string,
    confidence: candidate.confidence,
    x: box.origin.x,
    y: box.origin.y,
    width: box.size.width,
    height: box.size.height
  )
}

let encoder = JSONEncoder()
encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
FileHandle.standardOutput.write(try encoder.encode(items))
FileHandle.standardOutput.write(Data("\n".utf8))
