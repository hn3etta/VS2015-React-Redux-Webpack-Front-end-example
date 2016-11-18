// Utilities
import {objectsMatch} from './objectUtilities';

export default function objectArraysMatch(arr1, arr2) {

    if (arr1.length == 0 && arr2.length == 0) {
        return true;
    }

    if (arr1.length != arr2.length) {
        return false;
    }

    return arr1.every((obj, indx) => {
        return objectsMatch(obj, arr2[indx]);
    });

}
