import React from 'react'
import { Menu } from 'antd';
import { useEffect,useState} from 'react';
import { useSelector } from 'react-redux';
import * as echarts from 'echarts';

import { selectCurrStock } from '../../../AppSlice';
import { postRequest } from '../../../Tools/netRequest';
import {errorInfo} from '../../../Tools/Message';
import styles from './MainK.module.css';

const bgColor   = "#141826";//背景
const upColor   = "#F9293E";//涨颜色
const downColor = "#00aa3b";//跌颜色
const ma5Color  = "#39afe6";
const ma10Color = "#da6ee8";
const ma30Color = "#00940b";

const items = [
  {label:'1分线', key:'typeMin'},
  {label:'1时线', key:'typeHour'},
  {label:'1日线', key:'typeDay'},
  {label:'1周线', key:'typeWeek'},
  {label:'1月线', key:'typeMonth'}
];

export default function MainK() {
  const [currType, setCurrType] = useState('typeDay');
  const [dataChart, setDataChart] = useState(null);
  const currStock = useSelector(selectCurrStock);


  //切割数组
  const splitData = (rawData)=>{
    let datas = []; 
    let times = [];
    let vols = []; 
    for (let i = 0; i < rawData.length; i++) {
      datas.push(rawData[i]);
      // splice会修改数组 此处为删除数组第一个元素
      times.push(rawData[i].splice(0, 1)[0]);
      // 因为删除了数组第一个元素 所以vol由5递补到4
      vols.push(rawData[i][4]); 
    }
    return {
      datas:datas,
      times:times,
      vols:vols
    };
  }
  //计算MA
  const calculateMA = (dayCount,data)=>{
    var result = [];
    for (var i = 0, len = data.times.length; i < len; i++) {
      if (i < dayCount) {
        result.push('-');
        continue;
      }
      var sum = 0;
      for (var j = 0; j < dayCount; j++) {
        sum += data.datas[i - j][1];
      }
      result.push((sum / dayCount).toFixed(2));
    }
    return result;
  }
  //计算EMA
  const calcEMA = (n,data,field)=>{
    var i,l,ema,a;
    a=2/(n+1);
    if(field){
        //适配dif 计算ema26 ema12
        ema=[data[0][field]];  
        for(i=1,l=data.length;i<l;i++){
            ema.push((a*data[i][field]+(1-a)*ema[i-1]).toFixed(2));
        }
    }else{
        //适配dea 计算ema9
        ema=[data[0]];
        for(i=1,l=data.length;i<l;i++){
            ema.push((a*data[i]+(1-a)*ema[i-1]).toFixed(3) );
        }
    } 
    return ema;
  };
  //计算DIF
  const calcDIF = (short,long,data,field)=>{
    var i,l,dif,emaShort,emaLong;
    dif=[];
    emaShort=calcEMA(short,data,field);
    emaLong=calcEMA(long,data,field);
    for(i=0,l=data.length;i<l;i++){
        dif.push((emaShort[i]-emaLong[i]).toFixed(3));
    }
    return dif;
  };
  //计算DEA
  const calcDEA = (mid,dif)=>{
    return calcEMA(mid,dif);
  };
  //计算MACD
  const calcMACD = (short,long,mid,data,field)=>{
    let i,l,dif,dea,macd,result;
    result={};
    macd=[];
    dif=calcDIF(short,long,data,field);
    dea=calcDEA(mid,dif);
    for(i=0,l=data.length;i<l;i++){
        macd.push(((dif[i]-dea[i])*2).toFixed(3));
    }
    result.dif=dif;
    result.dea=dea;
    result.macd=macd;
    return result;
  };

  //设置echarts
  const initKOption = (retData)=>{
    // let data = splitData(cdata);
    // const retData = {
    //   mas:{
    //     ma5:calculateMA(5,data),
    //     ma10:calculateMA(10,data),
    //     ma30:calculateMA(30,data),
    //   },
    //   times:data.times,
    //   vols:data.vols,
    //   datas:data.datas,
    //   macds:calcMACD(12,26,9,data.datas,1), 
    // };
    return {
        tooltip: { //弹框指示器
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: { //图例控件,点击图例控制哪些系列不显示
          icon: 'rect', 
          type:'scroll',
          itemWidth: 14,
          itemHeight: 2,
          left: 0,
          top: '-1%',  
          animation:true,
          textStyle: {
            fontSize: 12,
            color: '#0e99e2'
          },
          pageIconColor:'#0e99e2'
        },
        axisPointer: {
          show: true
        },
        color: [ma5Color, ma10Color, ma30Color, upColor, upColor, '#da6ee8', '#39afe6'],  //标签色
        grid: [{
          id: 'gd1',
          left: '1%',
          right: '1%',
          top: '5%',
          height: '50%', //主K线的高度,
          containLabel:true,
        }, {
          left: '3%',
          right: '1%',
          top: '60%',
          height: '15%' //交易量图的高度
        }, {
          left: '3%',
          right: '1%',
          top: '80%', //MACD 指标
          height: '15%'
        }],
        xAxis: [ //==== x轴
          { //主图
            type: 'category',
            data: retData.times,
            scale: true,
            boundaryGap: false,
            axisLine: {
              onZero: false
            },
            axisLabel: { //label文字设置
              show: true,
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#3a3a3e'
              }
            },
            splitNumber: 20,
            min: 'dataMin',
            max: 'dataMax'
          }, { //交易量图
            type: 'category',
            scale: true,
            gridIndex: 1,
            data: retData.times,
            axisLabel: { //label文字设置
              show:true,
              color: '#9b9da9',
              // fontSize: 10
            },
          }, { //MACD图
            type: 'category',
            scale: true,
            gridIndex: 2,
            data: retData.times,
            axisLabel: {
              show: false
            }
          }
        ],
        yAxis: [ //y轴
          { //==主图
            scale: true,
            axisLabel: { //label文字设置
              color: '#c7c7c7',
              inside: false, //label文字朝内对齐
            },
            splitLine: { //分割线设置
              show: true,
              lineStyle: {
                // color: '#181a23'
                color:'#252A44',
              }
            },
            axisLine:{
              onZero: false,
              show: false,
            }
          }, { //交易图
            gridIndex: 1, splitNumber: 3, 
            axisLine: {
              onZero: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color:'#252A44',
              }
            },
            axisLabel: { //label文字设置
              color: '#c7c7c7',
              inside: false, //label文字朝内对齐 
              // fontSize: 8
            },
          }, { //MACD图
            // z:4, 
            gridIndex: 2,splitNumber: 3,
            axisLine: {
              onZero: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color:'#252A44',
              }
            },
            axisLabel: { //label文字设置
              color: '#c7c7c7',
              inside: false, //label文字朝内对齐 
              // fontSize: 8
            },
          }
        ],
        dataZoom: [{
            type: 'slider',
            xAxisIndex: [0, 1, 2], //控件联动
            start: 100,
            end: 25,
            throttle: 10,
            top: '97%',
            height: '2%',
            borderColor: '#696969',
            textStyle: {
              color: '#dcdcdc'
            },
            handleSize: '90%', //滑块图标
            dataBackground: {
              lineStyle: {
                color: '#fff'
              }, //数据边界线样式
              areaStyle: {
                color: '#696969'
              } //数据域填充样式
            }
          },
        ],
        animation: true, //动画效果
        backgroundColor: bgColor,
        blendMode: 'source-over',
        series: [{
            name: 'K线',
            type: 'candlestick',
            data: retData.datas,
            barWidth: '55%',
            large: true,
            largeThreshold: 100,
            itemStyle: {
              
                color: upColor, //fd2e2e  ff4242
                color0: downColor,
                borderColor: upColor,
                borderColor0: downColor,
      
                //opacity:0.8
              
            },
      
          }, {
            name: 'MA5',
            type: 'line',
            data: retData.mas.ma5,
            smooth: true,
            symbol: "none", //隐藏选中时有小圆点
            lineStyle: {
              
                opacity: 0.8,
                color: '#39afe6',
                width: 1
              
            },
          },
          {
            name: 'MA10',
            type: 'line',
            data: retData.mas.ma10,
            smooth: true,
            symbol: "none",
            lineStyle: { //标线的样式
              
                opacity: 0.8,
                color: '#da6ee8',
                width: 1
              
            }
          },
          {
            name: 'MA30',
            type: 'line',
            data: retData.mas.ma30,
            smooth: true,
            symbol: "none",
            lineStyle: {
              
                opacity: 0.8,
                width: 1,
                color: ma30Color
              
            }
          }, {
            name: 'VOL',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: retData.vols,
            // barWidth: '60%',
            barWidth: '55%',
            itemStyle: {
  
              color: function(params) {
                let currColor;
                if (retData.datas[params.dataIndex][1] > retData.datas[params.dataIndex][0]) {
                  currColor = upColor;
                } else {
                  currColor = downColor;
                }
                return currColor;
              },
              
            }
          }, {
            name: 'MACD',
            type: 'bar',
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: retData.macds.macd,
            barWidth: '55%',
            itemStyle: {
              
                color: function(params) {
                  let colorList;
                  if (params.data >= 0) {
                    colorList = upColor;
                  } else {
                    colorList = downColor;
                  }
                  return colorList;
                },
              
            }
          }, {
            name: 'DIF',
            type: 'line',
            symbol: "none",
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: retData.macds.dif,
            lineStyle: {
              
                color: '#da6ee8',
                width: 1
              
            }
          }, {
            name: 'DEA',
            type: 'line',
            symbol: "none",
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: retData.macds.dea,
            lineStyle: {
              
                opacity: 0.8,
                color: '#39afe6',
                width: 1
              
            }
          }
        ]
      };
  }


  const handleChangeType = (item)=>{
      setCurrType(item.key);
  }


  useEffect(()=>{
    setDataChart(echarts.init(document.getElementById('kdata')));
  },[]);

  useEffect(()=>{
    //为了防止React Hook useEffect has a missing dependency
    //使用的函数要在effect内部声明
    const handleResize = ()=>{
      const {offsetWidth, offsetHeight} = document.getElementById('kdata');
      // console.log(offsetWidth,offsetHeight);
      dataChart.resize({
        width: offsetWidth,
        height: offsetHeight,
      });
    }

    if(dataChart !== null){
      const kdataDiv = document.getElementById('kdata');
      const {offsetWidth, offsetHeight} = kdataDiv;
      dataChart.resize({
        width: offsetWidth,
        height: offsetHeight,
      });
      window.addEventListener('resize', handleResize, true);
    }

    //add和remove的第二个参数的地址必须一致，这里需要在一个域中声明
    return ()=>{
      window.removeEventListener('resize',handleResize, true);
    };

  },[dataChart]);

  // useEffect(()=>{
  //   return ()=>{
  //     console.log('unmount App');
  //     window.removeEventListener('resize',handleResize, true);
  //     console.log('remove ok');
  //   };
  // },[]);
  
  //useState的set方法是异步的，当后续代码必须在state更新后执行时
  //不比在一个useEffect中写，而是新起一个useEffect并申明只有当该state刷新时才生效

  // useEffect(()=>{
  //   console.log(1);
  // })

  useEffect(()=>{
    if(dataChart === null)return;
    postRequest('kdata',{code:currStock, type:currType})
    .then((data)=>{
      if(data.state === true){
        const option = initKOption(data.datas);
        dataChart.setOption(option);
      }
      else{
        errorInfo('获取k线数据失败!');
      }
    })
    .catch((err)=>{
      console.log(err);
    });
  }, [currStock, currType, dataChart]);

  return (
    <div className={styles.main}>
        <Menu
          theme='dark'
          className={styles.menu}
          mode="horizontal"
          items={items}
          defaultSelectedKeys={['typeDay']}
          onSelect={handleChangeType}
        >
        </Menu>

        <div className={styles.kdata} id="kdata"></div>
       
    </div>
  )
}
