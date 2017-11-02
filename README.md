# Fort Awesome Everywhere!

## What are icon fonts?
* Icon fonts are a very popular technique on the web where loading images can be slow and increase the size of websites unecessarily. 
* Instead of using individual image files for each icon, an icon font is a special font that has icons instead of letters, giving you infinitely scalable icons that are easily customized in CSS.
* Natively supported by CSS, making them a no brainer to use on the web when you need icons on your site. 

## Why use icon fonts?
* A **unified icon set** across all your platforms (web, iOS, Android). 
* A **single file to update** when new icons are added or changed. 
* Set or **change the color of any icon at runtime** by simply specifying a color in a layout file or in code.
* **Infinite resolution with a tiny file size**. Since icons are vector graphics, they can be scaled infinitely to any size and take up a tiny amount of space on disk.*

###### *A sample large production app's entire icon set comes in at around ~32 KB. No more @2x, @3x, hdpi, mdpi, xhdpi, xxhdpi, xxxhdpi. Just one, tiny-file-size, infinitely scalable vector. 



## Fort Awesome Everywhere is a **guide** and **tool** to bring CSS-like ease of use of custom Fort Awesome icon fonts to native iOS and Android development. 

#### Note: Font Awesome vs Fort Awesome. What is the difference? 
* [Font Awesome](http://fontawesome.io/) is a fantastic _free_ font icon set. If you only need generic/standard icons in your app, do yourself a favor and use Font Awesome; using Font Awesome natively in iOS is trivial with the help of a [third party library](https://github.com/PrideChung/FontAwesomeKit). 
* [Fort Awesome](https://fortawesome.com) is like Font Awesome, but adds the ability to upload custom icons to create your own custom font icon sets. Its fantastic for when your app or brand has custom/proprietary icons that are unique to your brand.

One of the biggest challenges to using custom Fort Awesome icon sets is mapping the **descriptive human-friendly identifiers** (like "fa-shopping-cart") to their **computer-friendly Unicode representation** ("f07a"). _Fort Awesome Everywhere_ is a **tool** that generates a json mapping file (for iOS) and an xml file for Android Studio from your custom Fort Awesome font. Below is the **guide** to _Fort Awesome Everywhere_ where you will learn how easy it is to implement in your app.



# iOS

## Setup 

#### 1) Download your kit from [Fort Awesome](https://fortawesome.com/kits/), drag the .ttf file into your Xcode project, and add the `Fonts provided by application` key to your Info.plist with an entry that is the name of your font including the .ttf file extension (i.e. `myfont.ttf`). 



#### 2) Follow the instructions [here](https://dockwa.github.io/fort-awesome-everywhere/), and add the downloaded JSON file to your Xcode project.
###### _This is where the magic happens; this file maps the Unicode characters to their Fort Awesome identifiers._




#### 3) Add the [FontAwesomeKit](https://github.com/PrideChung/FontAwesomeKit) Core library to your project. If you use CocoaPods:
```ruby
'pod FontAwesomeKit/Core'
```

#### 4) Use the sample class [here](https://github.com/dockwa/fort-awesome-everywhere/blob/gh-pages/Icon.swift) and customize if needed. The key methods that make it all work are ```class func allIcons() -> [AnyHashable: Any]``` and ```class func iconFont(withSize size: CGFloat) -> UIFont```. 


## Usage


#### 1) Create a UIImage to show your icon in a UIImageView (easiest, has sensible defaults to work for most scenarios): 
```swift 
Icon.image(named: "camera", color: .green)
```

#### 2) If you need to customize the icon's size and/or positioning, create an Icon object and customize as needed.
```swift
Icon.icon(named: "water", size: 26)?.image(size: CGSize(width: 20, height: 20), color: .blue)
```

###### Check out the excellent [FontAwesomeKit](https://github.com/PrideChung/FontAwesomeKit#example-usage) library for more details. 







# Android

## Setup 

#### 1) Download your kit from [Fort Awesome](https://fortawesome.com/kits/) and drag the .ttf file into your Android Studio project. 


#### 2) Follow the instructions [here](https://dockwa.github.io/fort-awesome-everywhere/), and add the downloaded ```icons.xml``` file to your Android Studio project in the ```res/values``` folder.
###### _This is where the magic happens; this file maps the Unicode characters to their Fort Awesome identifiers, and since it is a string resource XML file, Android Studio will autocomplete these identifiers in code and layout files._


#### 3) Add the [fonticon](https://github.com/shamanland/fonticon#gradle-dependency) library to your project. If you use Gradle:
```groovy
dependencies {
    compile 'com.shamanland:fonticon:0.1.9'
}
```

#### 4) In your Application's ```onCreate()``` method, call this method to load the font. 
```java 
FontIconTypefaceHolder.init(getAssets(), "YOUR_FONT_FILE_NAME.ttf");
```

## Usage

### In XML Layout

#### 1) Ceate a TextView in an XML layout and set its ```text``` attribute to ```@string/icon_identifier```, using the icon's identifier found in the ```icons.xml``` file we created earlier.
```xml
<TextView
    android:id="@+id/view_iconTextView"
    android:text="@string/icon_identifier" />
```


#### 2) After inflating the layout in code, make sure to set the TextView's typeface as below:
```java
textView.setTypeface(Typeface.createFromAsset(context.getAssets(), "YOUR_FONT_FILE_NAME.ttf"));
```
    

### In Code

#### TextView:

#### 1) Get the icon code:
You can get the icon code by implementing a method like the one below. It looks up the identifier in the ```icons.xml``` file we created earlier, and returns the corresponding Unicode character to set on a TextView. 
```java
public class MyFortAwesomeFont {
    public static String fontIconCodeFromIdentifier(Context context, String identifier) {
        if (identifier == null) { return null; }
    
        String xmlLookup = context.getPackageName() + ":string/" + identifier;
        int resourceID = context.getResources().getIdentifier(xmlLookup, null, null);
        if (resourceID == 0) { return null; }

        String iconCode = context.getResources().getString(resourceID);
        return iconCode;
    }
}
 ```
 
#### 2) Set the typeface and text on the TextView:
```java
String code = MyFortAwesomeFont.fontIconCodeFromIdentifier(getContext(), "fort_awesome_identifier");
if (code != null) {
    textView.setTypeface(Typeface.createFromAsset(getContext().getAssets(), "YOUR_FONT_FILE_NAME.ttf"));
    textView.setText(code);
}
```

#### Drawable:

#### 1) _For each icon you want to use as a Drawable_, you must make an XML file like the one below, save it as ```icon_name.xml``` and put the file in ```res/xml```. 
Note: The opening tag must be ```font-icon```, exactly as it is below. Change ```icon_identifier```, ```textColor```, and ```textSize``` to whatever you require for the particular icon. 

```xml
<font-icon
    xmlns:android="http://schemas.android.com/apk/res-auto"
    android:text="@string/icon_identifier"
    android:textSize="40sp"
    android:textColor="@android:color/black" />
```

#### 2) Create the Drawable
```java
Drawable icon = FontIconDrawable.inflate(getContext(), R.xml.icon_name);
```
###### Check out the excellent [fonticon](https://github.com/shamanland/fonticon#usage) library for more details.
