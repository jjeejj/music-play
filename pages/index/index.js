let rotate = 0; //旋转角度默认为为0
//http://s.music.163.com/search/get/?type=1&limit=1&s=%E5%BE%80%E4%BA%8B
Page({
  data: {
    inputValue:"",
    picUrl:"http://test-1252734879.costj.myqcloud.com/images/tooopen_sy_196830252422.jpg",
    musicUrl:"http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46",
    author:"许巍",
    name:"此时此刻",
    rotateFlag: false, // 控制专辑图片是否在旋转
    transform:""//控制旋转的的css属性，默认不旋转

  },
  onLoad: function () {
    console.log('onLoad')
    var that = this;
  },
  onReady:function(){
    this.audioCtx  = wx.createAudioContext("myAudio");
  },
  onHind:function(){
  },
  //查询歌曲的输入绑定事件
  bindMusicNameInput:function(event){
    var inputValue = event.detail.value
    this.setData({
      inputValue:inputValue
    })
    return inputValue;
  },
  // 点击搜索事件
  searchMusic:function(){
    var page = this;
    var inputValue = this.data.inputValue;

    if(inputValue){
        var url = `http://s.music.163.com/search/get/?type=1&limit=1&s=${inputValue}`
        wx.request({
            url:  url, //仅为示例，并非真实的接口地址
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              console.log(res.data);
              var result = res.data.result;

              if(result &&  result.songs.length>0){
                var music = result.songs[0];
                page.setData({
                  rotateFlag:false,
                  transform:`transform:rotate(${-rotate}deg);`, //恢复到正常的角度
                  picUrl:music.album.picUrl,
                  name:music.name,
                  musicUrl:music.audio,
                  author:music.artists[0].name
                });
                rotate = 0;
              }else{
                wx.showToast({
                  title: '无查询歌曲，请重新输入',
                  duration: 10000,
                  mask:true
                })

setTimeout(function(){
  wx.hideToast()
},2000)
              }
            }
        })
    }
    
  },
  // 开始音乐--开始旋转
  playMusic:function(){
    this.setData({
      rotateFlag:true
    });
    this.myRotate();
  },
  // 暂停音乐
  pauseMusic:function(){
    this.setData({
      rotateFlag:false
    });
  },
  // 控制专辑图片旋转
  toggleRotate: function() {
    console.log('旋转控制');
    if (this.data.rotateFlag) {
      this.pauseMusic();
      this.audioCtx.pause();
    } else {
      this.playMusic();
      this.audioCtx.play();
    }
  },
  //旋转函数
  myRotate: function() {
    rotate++;
    let transform = `transform:rotate(${rotate}deg);`; //变换角度
    this.setData({
      transform:transform
    });
    const animation = setTimeout(() => {
      this.myRotate();
    }, 30);
    if (!this.data.rotateFlag) {
      clearTimeout(animation);
    };
  },
})
