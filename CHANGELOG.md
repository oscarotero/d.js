# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## 2.1.0 - 2017-10-20

### Added

* Restore the second argument in `d.get()` and `d.getAll()` to define a context
* Added a polyfill to `:scope` selector

## 2.0.1 - 2017-08-04

### Fixed

* Fixed `Element.prototype.closest`.

## 2.0.0 - 2017-08-04

### Added

* Added a polyfill to `Element.prototype.closest`
* Added a polyfill to `Element.prototype.replaceWith`
* Added a polyfill to `NodeList.prototype.forEach`

### Removed

* Drop support for IE10
* Drop *dist* folder
* Removed `d.is()` and implemented a polyfill for `Element.prototype.matches` instead.
* Removed `d.remove()` and implemented a polyfill for `Element.prototype.remove` instead.
* Removed `d.append()` and implemented a polyfill for `Element.prototype.append` instead.
* Removed `d.prepend()` and implemented a polyfill for `Element.prototype.prepend` instead.
* Removed `d.insertBefore()` and implemented a polyfill for `Element.prototype.before` instead.
* Removed `d.insertAfter()` and implemented a polyfill for `Element.prototype.after` instead.
* Removed the ability to create instances to chain functions

### Changed

* `d.getAll()` returns a NodeList, instead an array
* `d.parse()` returns a documentFragment, instead an array

### Fixed

* Fixed custom events in IE

## 1.10.0 - 2017-07-20

### Added

* The callback of `d.delegate()` includes a second argument with the target.

### Removed

* Removed code for Opera 11.5 compatibility.

## 1.9.0 - 2017-04-19

### Removed

* Removed the functions `d.getData()` and `d.setData()`.

### Added

* New function `d.data()` to set/get data
* Added `.data()` to the prototype

### Fixed

* Fixed `d.delegate()` with custom events

## 1.8.0 - 2017-04-17

* New functions `d.getData()` and `d.setData()`.

## 1.7.0 - 2017-04-12

### Added

* New function `d.siblings()`

## 1.6.0 - 2017-02-24

### Changed

* Removed the second argument of `d.get` and `d.getAll` (to select the context). Now you have to use a plain object. For example: `d.get({'li': document})`. This allows to use context in other functions like `d.on`, `d.insertAfterTo`, etc...

## 1.5.0 - 2017-01-10

### Added

* New function `d.delegate()`

## 1.4.0 - 2016-08-30

### Added

* Allow to attach multiple events at once

### Removed

* `get` and `getAll` functions from OOP API

### Fixed

* ESLint code fixes

## 1.3.0 - 2016-08-21

### Added

* Ability to use arrays for css values
* Added a second argument in `d.parse()` to return always an array

### Fixed

* Fixed error on manipulating not-found nodes

## 1.2.0 - 2016-08-20

### Added

* Allow to use html code as the argument of `insertAfter`, `insertBefore`, `append` and `prepend` (in addition to node elements), and changed the argument order
* New methods `insertAfterTo`, `insertBeforeTo`, `appendTo` and `prependTo`.

### Fixed

* Improved events

## 1.1.0 - 2016-08-18

### Added

* Ability to create `d` instances. For example:
* New functions: `insertAfter`, `insertBefore`, `append`, `prepend`

## 1.0.0 - 2016-08-15

First stable version