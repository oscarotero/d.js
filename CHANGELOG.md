# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

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