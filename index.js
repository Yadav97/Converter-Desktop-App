const electron = require('electron');

const _ = require('lodash');

const ffmpeg = require('fluent-ffmpeg');
const {app,BrowserWindow,ipcMain,shell} = electron;


let mainWindow;
app.on('ready',()=>{
mainWindow =  new BrowserWindow({height:600,width:800,webPrefernces : {backgroundThrottling :false}});

mainWindow.loadURL(`file://${__dirname}/src/index.html`);

})


//here 'videos' argument store the all videos that come from the redux code by using ipc
//at src-->actions-->index.js
ipcMain.on('videos:added',(event,videos)=>{

//console.log(videos);
//ffmpeg.ffprobe(path of video , (err,metadata)=>{});
//videos[0].path==take the video at 0 index and give path of that 0th index video

//NOTE-->we make the promise for async programming

// const promise = new Promise((resolve,reject)=>{
//
// ffmpeg.ffprobe(videos[0].path,(err,metadata)=>{
// resolve(metadata);
//   });
// });
//
// promise.then((metadata)=>{console.log(metadata)},()=>{})

//NOTE-2-->make the promise for every video that user has drag
//ek ek object 'video' arg mein store hoga then pass as argument aisa har video ke liye hoga jo
//collection mein 'videos'
//_.map() return the ARRAY OF PROMISES
//results store the array of promises
const promises = _.map(videos,video=>{
		return new Promise((resolve,reject)=> {
			ffmpeg.ffprobe(video.path,(err,metadata)=>{
        video.duration = metadata.format.duration;
        video.format = 'avi'
//to set the default on screen for converting
        resolve(video);
    //   console.log(metadata);
	});

});
         });

		Promise.all(promises)
    .then((results)=>{
    mainWindow.webContents.send('metadata:completed',results);
	//	console.log(results);
	});

//here results store thw array of promises

});

//see at terminal for video metadata
//metadata.format.duration
//here in metadata ke andar jo format key hai uski value ek object and is object ke andar ek duration key jo ki
//uski value hume chhiye like see below
// format : {filename:'',start_time: 0,
//      duration: 320.969422,
//      size: 7585249,
//      bit_rate: 189058,
//      probe_score: 100,
//           }

ipcMain.on('conversion:start',(event,videos) => {
//actual code to convert the video




//check only for 1 video means array of object mein se pehla object utha liya hai
// const video = videosdata[0];
// console.log(video);

_.map(videos,video => {
//here they work exactly same as _.map() like the iterator

const outputDirectory =   video.path.split(video.name)[0];
// video mein se path uthalo then path ko split karna hai by video ke name se at 0th index waali video ko


const outputName = video.name.split('.')[0];

	const outputPath = `${outputDirectory}${outputName}${video.format}`;
  //
	// console.log(outputDirectory)  //we remove the file name output ==>home/krishna/desktop
	 console.log(outputPath);  //here aaaa file name ,output is ----->aaaaa
  //

//.output mein file name aayega jo hume chahiye conversion ke baad

ffmpeg(video.path)
  .output(outputPath)
  .on('progress' , (event)=>{console.log(event);})
//  .on('progress',({timemark	}) => {mainWindow.webContents.send('conversion:progress',{video,timemark})}	)
  //here we destructuring the timemark from event
  .on('end' , () => {mainWindow.webContents.send('conversion:end' , {video,outputPath})})
  .run();

//.run() start the processing


});



});

ipcMain.on('folder:open',(event,outputPath)=>{
shell.showItemInFolder(outputPath);
console.log("hello terminal");

})
