import FontAwesomeKit

public class Icon: FAKIcon {

    //MARK: - Preferred Init

    //usage: when you need an image, usually the method below will be what you want. it has some sensible defaults.
    //however, sometimes you may need to create the icon with a specific size and then call its image method for special cases
    public class func image(named identifier: String, color: UIColor? = nil, size: CGSize? = nil) -> UIImage? {
        let size = size ?? CGSize(width: 35, height: 35)

        let icon = Icon.icon(named: identifier, size: 26)
        let image = icon?.image(size: size, color: color)
        return image
    }


    //MARK: - If Custom Needed

    //method to create a new DockwaIcon with the given identifier and size
    public class func icon(named identifier: String, size: CGFloat? = nil) -> Icon? {
        let linted = lintIdentifier(identifier)
        let size = size ?? 26

        do {
            return try Icon(identifier: linted, size: size)
        }
        catch let error {
            print(error)
            return nil
        }
    }

    //method to create an image from an icon with the given color and size
    public func image(size: CGSize, color: UIColor?) -> UIImage {
        if let color = color {
            addAttribute(NSAttributedStringKey.foregroundColor.rawValue, value: color)
        }
        return self.image(with: size)
    }


    public override class func allIcons() -> [AnyHashable: Any] {
        return dictionaryFromFile("\(fontName())_icon_map")
    }

    public override class func iconFont(withSize size: CGFloat) -> UIFont {
        super.registerFont(with: Bundle.main.url(forResource: fontName(), withExtension: "ttf")!)
        return UIFont(name: fontName(), size: size)!
    }
}


//MARK: - Helpers

extension Icon {

    private static func fontName() -> String {
        guard let names = Bundle.main.object(forInfoDictionaryKey: "UIAppFonts") as? [String], let name = names.first, let split = name.split(separator: ".").first else {
            fatalError("You mut add the 'Fonts Provided by Application' key to your Info.plist")
        }
        return String(split)
    }

    private static func lintIdentifier(_ identifier: String) -> String {
        let lowercase = identifier.lowercased()
        let removeAmpersand = lowercase.replacingOccurrences(of: "&", with: "and")
        let removeSlash = removeAmpersand.replacingOccurrences(of: "/", with: "-")
        let hyphencase = removeSlash.replacingOccurrences(of: " ", with: "-")
        return hyphencase
    }

    private static func dictionaryFromFile(_ filename: String) -> [String : String] {
        let path = Bundle.main.path(forResource: filename, ofType: "json")!
        let jsonData = try! Data(contentsOf: URL(fileURLWithPath: path))
        let json = try! JSONSerialization.jsonObject(with: jsonData, options: .allowFragments)
        return json as! [String : String]
    }
}
