ie6fixed
========

position: fixed hack for ie6

## Feature

support ie6 css style:

```css
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
```

> no shake and super smooth while scrolling or resize the window

## Usage

```js
ie6fixed(
    document.getElementById('your-element-need-fixed-on-ie6'),
    {
        top: 0,
        left: 0
    }
);
```

more [demo](http://jinzhubaofu.github.io/ie6fixed)
