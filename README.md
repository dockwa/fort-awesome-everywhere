# fort-awesome-everywhere
Fort Awesome on the web, iOS, and Andriod.

But how? That sounds complicated! Fear no more friends, here's a super simple solution to implementing custom Fort Awesome icon fonts to supply all of the icons across your entire product line, on web, iOS, and Android!


iOS:

1) Download your .ttf font file from Fort Awesome, add it to your Xcode project.


2) Go to your Fort Awesome dashboard, copy the ID at the end of the url, and paste it [here](https://knotlabs.github.io/fort-awesome-everywhere/). Then click **Export JSON Map**, copy the JSON, paste it into a text file, and save it as ```FONT_NAME_font_map.json``` (or whatever you prefer). Add this JSON file to your Xcode project.


3) Add the [FontAwesomeKit Cocoapod](https://github.com/PrideChung/FontAwesomeKit) to your project.


2) Subclass FAKIcon and override this method as below:
```objective-c
+ (UIFont *)iconFontWithSize:(CGFloat)size
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        [self registerIconFontWithURL:[[NSBundle mainBundle] URLForResource:@"YOUR_FONT_FILE_NAME" withExtension:@"ttf"]];
    });

    UIFont *font = [UIFont fontWithName:@"YOUR_FORT_AWESOME_FONT_NAME" size:size];
    NSAssert(font, @"UIFont object should not be nil, check if the font file is added to the application bundle and you're using the correct font name.");
    return font;
}
```

3) And override this method as below. This is where the magic happens. In this method, we will load up the json mapping file that we generated in step 2 to map the human-friendly identifiers (like "fa-search") to their computer-friendly character codes (like "f028").

```objective-c
+ (NSDictionary *)allIcons
{
    NSString *path = [[NSBundle bundleForClass:self] pathForResource:@"FONT_NAME_font_map" ofType:@"json"];
    NSData *jsonData = [NSData dataWithContentsOfFile:path];

    NSDictionary *json = [NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingAllowFragments error:nil];
    return json;
}
```

4) To use a custom Fort Awesome icon in your app, just call this method and pass in your identifier. So easy! So Magic!
```objective-c
+ (instancetype)iconWithIdentifier:(NSString *)identifier size:(CGFloat)size error:(NSError **)error;
```

5) Profit
