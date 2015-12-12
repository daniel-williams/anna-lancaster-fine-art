import Rebase from 're-base';
import {
    GALLERIES_REQUESTED,
    GALLERIES_RECEIVED,
    UPDATE_GALLERIES,
    ART_REQUESTED,
    ART_RECEIVED,
    UPDATE_ART,
    INDEX_REQUESTED,
    INDEX_RECEIVED,
    UPDATE_INDEX,
    CHAPTER_REQUESTED,
    CHAPTER_RECEIVED,
    UPDATE_CHAPTER
} from '.';

var galleries = Rebase.createClass('https://blistering-torch-4532.firebaseio.com/gallery');

export function bootstrap() {
    return function(dispatch) { // thunk
        dispatch({type: GALLERIES_REQUESTED});

        galleries.fetch('gallery', {
            context: {},
            asArray: true,
            then(data) {
                dispatch({type: UPDATE_GALLERIES, galleries: data});
                dispatch({type: GALLERIES_RECEIVED});
            }
        });
    }
}

export function fetchIndex(url) {
    return function(dispatch) { // thunk
        dispatch({type: INDEX_REQUESTED}); // notify start

        return fetch(url)
            .then(res => res.json())
            .then(json => {
                dispatch({type: UPDATE_INDEX, chapters: json});
                dispatch({type: INDEX_RECEIVED}); // notify end
            })
            .catch(err => console.debug('Oops!', err));
    }
}
export function getChapter(chapter, url) {
    return function(dispatch) { // thunk
        dispatch({type: CHAPTER_REQUESTED, chapter}); // notify start

        return fetch(url)
            .then(res => res.text())
            .then(content => {
                dispatch({type: UPDATE_CHAPTER, chapter: chapter, content: content});
                dispatch({type: CHAPTER_RECEIVED, chapter}); // notify end
            })
            .catch(err => console.debug('Oh snap!', err));
    }
}
