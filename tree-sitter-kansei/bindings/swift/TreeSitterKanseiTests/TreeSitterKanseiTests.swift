import XCTest
import SwiftTreeSitter
import TreeSitterKansei

final class TreeSitterKanseiTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_kansei())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Kansei grammar")
    }
}
