import { ADD_VIDEO, ADD_VIDEOS, REMOVE_VIDEO, REMOVE_ALL_VIDEOS, VIDEO_PROGRESS, VIDEO_COMPLETE } from "./types";
import { ipcRenderer } from "electron";


// TODO: Communicate to MainWindow process that videos
// have been added and are pending conversion
//jab drag and drop area par click karenge toh this function is call 'addVideos' and arguments is the list of  videos that user
//drag
export const addVideos = videos => dispatch => {

ipcRenderer.send('videos:added',videos);

ipcRenderer.on('metadata:completed',(event,videoWithData)=>{

  dispatch({type:ADD_VIDEOS, payload : videoWithData});
});

};






// TODO: Communicate to MainWindow that the user wants
// to start converting videos.  Also listen for feedback
// from the MainWindow regarding the current state of
// conversion.
export const convertVideos = videos => dispatch => {

  //jab user convert button par click karega so this funcrion is call

//here video store the list of videos and pass as arguments and give by convertVideos function
ipcRenderer.send('conversion:start',videos);

//here we destructuring the object
ipcRenderer.on('conversion:end' , (event , {video,outputPath})=>{
dispatch({type:VIDEO_COMPLETE,payload:{...video,outputPath}});
});
ipcRenderer.on('conversion:progress' , (event,{video,timemark})=>{

  dispatch({type:VIDEO_PROGRESS,payload:{...video,timemark}});

});


};







// TODO: Open the folder that the newly created video
// exists in
export const showInFolder = outputPath => dispatch => {

ipcRenderer.send('folder:open' , outputPath);




};

export const addVideo = video => {
  return {
    type: ADD_VIDEO,
    payload: { ...video }
  };
};

export const setFormat = (video, format) => {
  return {
    type: ADD_VIDEO,
    payload: { ...video, format, err: "" }
  };
};

export const removeVideo = video => {
  return {
    type: REMOVE_VIDEO,
    payload: video
  };
};

export const removeAllVideos = () => {
  return {
    type: REMOVE_ALL_VIDEOS
  };
};
