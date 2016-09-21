# Fort Awesome Everywhere

* Are you tired of having 6,000,000 pngs floating around your iOS and Android projects? Are you tired of having to resize your images for @2x, @3x, hdpi, mdpi, xhdpi, xxhdpi, xxxhdpi, etc?
* Are you tired of having to keep your image assets in sync across three different platforms at endless sizes and densities?
* Do you wish you could instead use a single file that stored all of your images and icons, at _infinite_ resolution, future proofed for any new device sizes and screen technologies?
* Do you wish you could change the color of your icons by simply specifying a color in a layout file or code?

But how? This sounds too good to be true...

**Fear not friends, there is a solution to all of your above problems and wishes! By using a custom Fort Awesome icon font and this simple script and tutorial, you can enjoy all of these benefits with barely any effort.**

# iOS

## Setup 

1) Download your .ttf font file from Fort Awesome, add it to your Xcode project.


2) Go to your Fort Awesome dashboard, copy the ID at the end of the url, and paste it [here](https://knotlabs.github.io/fort-awesome-everywhere/). 
Then click **Export JSON Map**, copy the JSON, paste it into a text file, and save it as ```FONT_NAME_font_map.json``` (or whatever you prefer). 
Add this JSON file to your Xcode project.


3) Add the [FontAwesomeKit Cocoapod](https://github.com/PrideChung/FontAwesomeKit) to your project.

    ```ruby
    'pod FontAwesomeKit/Core'
    ```


4) Subclass FAKIcon and override ```+ (UIFont *)iconFontWithSize:(CGFloat)size``` as below
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

5) Also override the ```+ (NSDictionary *)allIcons``` method as below. This is where the magic happens. In this method, we will load up the json mapping file that we generated earlier to map the human-friendly identifiers (like "fa-search") to their computer-friendly character codes (like "f028").

    ```objective-c
    + (NSDictionary *)allIcons
    {
        NSString *path = [[NSBundle bundleForClass:self] pathForResource:@"FONT_NAME_font_map" ofType:@"json"];
        NSData *jsonData = [NSData dataWithContentsOfFile:path];

        NSDictionary *json = [NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingAllowFragments error:nil];
        return json;
    }
    ```
## Usage

### Code

- To use a custom Fort Awesome icon in your app, call this method from your FAKIcon subclass and pass in your identifier
    ```objective-c
    + (instancetype)iconWithIdentifier:(NSString *)identifier size:(CGFloat)size error:(NSError **)error;
    ```

- To show your font icon in a UIImageView, create an image from your font icon by calling:
    ```objective-c
    - (UIImage *)imageWithSize:(CGSize)imageSize;
    ```
- To show your font icon in a UILabel or UITextView, create an attributed string from your font icon by calling:
    ```objective-c
    - (NSAttributedString *)attributedString;
    ```

You can check out the [FontAwesomeKit Cocoapod](https://github.com/PrideChung/FontAwesomeKit) for more details on how to use font icons in your app. 

# Android

## Setup 

1) Download your .ttf font file from Fort Awesome, add it to your Android Studio project into the src/main/assets folder (or wherever you prefer).


2) Go to your Fort Awesome dashboard, copy the ID at the end of the url, and paste it [here](https://knotlabs.github.io/fort-awesome-everywhere/). 
Then click **Export XML Map**, copy the XML, paste it into a text file, and save it as ```icons.xml``` (or whatever you prefer). 
Add this string resource XML file to your Android Studio project in the res/values folder.


3) Add this [Fonticon library](https://github.com/shamanland/fonticon) to your project. If you use Gradle:
```groovy
dependencies {
    compile 'com.shamanland:fonticon:0.1.9'
}
```

4) In your Application's ```onCreate()``` method, call this method to load the font. 
```java 
FontIconTypefaceHolder.init(getAssets(), "YOUR_FONT_FILE_NAME.ttf");
```

## Usage

### XML Layout
To set a font icon in an XML layout: 

- Ceate a TextView in XML and set its ```android:text``` attribute to ```@string/name_of_icon```.

- When you inflate the layout in code, set the TextView's typeface as below:

     ```java
    textView.setTypeface(Typeface.createFromAsset(context.getAssets(), "YOUR_FONT_FILE_NAME.ttf"));
    ```
### Code

- First you need to use the string resource XML file to translate between the human-friendly identifiers in Fort Awesome and raw character codes. You can do this by implementing a method like the one below: 

    ```java
    public static String fontIconCodeFromIdentifier(Context context, String identifier) {
        if (identifier == null) { return null; }

        String xmlLookup = context.getPackageName() + ":string/" + identifier;
        int resourceID = context.getResources().getIdentifier(xmlLookup, null, null);
        if (resourceID == 0) { return null; }

        String iconCode = context.getResources().getString(resourceID);
        return iconCode;
    }
     ```
    #### Directly in a TextView
    ```java
    String code = fontIconCodeFromIdentifier(getContext(), "fort_awesome_identifier");
    if (code != null) {
        textView.setText(code);
    }
    ```

    #### As a Drawable
    
- To use a font icon as a Drawable, you must _for each icon_ make an XML file like the one below, save it as ```icon_name.xml``` and put it in res/xml (prefixing with ```icon_``` will help keep your res/xml folder organized). Change ```textColor``` and ```textSize``` to whatever suits your needs. 

    ```xml
     <font-icon
        xmlns:android="http://schemas.android.com/apk/res-auto"
        android:text="@string/icon_name_from_string_resource_file"
        android:textSize="40sp"
        android:textColor="@android:color/black" />
    ```

- Then call this method in your to create the Drawable, passing in the name of the xml file you just created. 
    
    ```android
    Drawable icon = FontIconDrawable.inflate(getContext(), R.xml.icon_name);
    ```
You can also find more info from the [fonticon repo](https://github.com/shamanland/fonticon#usage).
