# @aphrodite-engine-provider

## 0.2.3
    - Fixed baseURL initialization to properly handle undefined values
    - Improved error handling in getModels function
    - Updated getModels to return array of model IDs

## 0.2.2

    - Fixed bug where getModel() method was not returning correctly 100% of the time.
    - error will still occur when trying to use getModel() pass "default" in as modelName until a fix is created.

## 0.2.1
    - Fixed bug where getModel() was not accessible.

## 0.2.0
    - Dynamic Model Name
        - Allows for the model to be swapped out and dynamically loaded without changing configurations.

## 0.1.0
    - Release to npm

## 0.0.1
    - initial commit