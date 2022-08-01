import React from 'react'
import { Menu } from 'antd';
import { useEffect,useState} from 'react';
import { useSelector } from 'react-redux';
import * as echarts from 'echarts';

import { selectCurrStock } from '../../../AppSlice';
import { postRequest } from '../../../Tools/netRequest';
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
  const initKOption = (cdata)=>{
    let data = splitData(cdata);
    let macd = calcMACD(12,26,9,data.datas,1);  
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
          left: '0%',
          right: '1%',
          top: '5%',
          height: '50%', //主K线的高度,
        }, {
          left: '0%',
          right: '1%',
          top: '56%',
          height: '15%' //交易量图的高度
        }, {
          left: '0%',
          right: '1%',
          top: '75%', //MACD 指标
          height: '19%'
        }],
        xAxis: [ //==== x轴
          { //主图
            type: 'category',
            data: data.times,
            scale: true,
            boundaryGap: false,
            axisLine: {
              onZero: false
            },
            axisLabel: { //label文字设置
              show: false
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
            gridIndex: 1,
            data: data.times,
            axisLabel: { //label文字设置
              color: '#9b9da9',
              fontSize: 10
            },
          }, { //MACD图
            type: 'category',
            gridIndex: 2,
            data: data.times,
            axisLabel: {
              show: false
            }
          }
        ],
        yAxis: [ //y轴
          { //==主图
            scale: true,
            // z:4,
            axisLabel: { //label文字设置
              color: '#c7c7c7',
              inside: true, //label文字朝内对齐
            },
            splitLine: { //分割线设置
              show: false,
              lineStyle: {
                color: '#181a23'
              }
            },
          }, { //交易图
            gridIndex: 1, splitNumber: 3, 
            // z:4,
            axisLine: {
              onZero: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: { //label文字设置
              color: '#c7c7c7',
              inside: true, //label文字朝内对齐 
              fontSize: 8
            },
          }, { //MACD图
            // z:4, 
            gridIndex: 2,splitNumber: 4,
            axisLine: {
              onZero: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: { //label文字设置
              color: '#c7c7c7',
              inside: true, //label文字朝内对齐 
              fontSize: 8
            },
          }
        ],
        dataZoom: [{
            type: 'slider',
            xAxisIndex: [0, 1, 2], //控件联动
            start: 100,
            end: 25,
            throttle: 10,
            top: '95%',
            height: '3%',
            borderColor: '#696969',
            textStyle: {
              color: '#dcdcdc'
            },
            handleSize: '90%', //滑块图标
            // handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
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
        animation: false, //禁止动画效果
        backgroundColor: bgColor,
        blendMode: 'source-over',
        series: [{
            name: 'K线',
            type: 'candlestick',
            data: data.datas,
            barWidth: '55%',
            large: true,
            largeThreshold: 100,
            itemStyle: {
              normal: {
                color: upColor, //fd2e2e  ff4242
                color0: downColor,
                borderColor: upColor,
                borderColor0: downColor,
      
                //opacity:0.8
              }
            },
      
          }, {
            name: 'MA5',
            type: 'line',
            data: calculateMA(5,data),
            smooth: true,
            symbol: "none", //隐藏选中时有小圆点
            lineStyle: {
              normal: {
                opacity: 0.8,
                color: '#39afe6',
                width: 1
              }
            },
          },
          {
            name: 'MA10',
            type: 'line',
            data: calculateMA(10,data),
            smooth: true,
            symbol: "none",
            lineStyle: { //标线的样式
              normal: {
                opacity: 0.8,
                color: '#da6ee8',
                width: 1
              }
            }
          },
          {
            name: 'MA30',
            type: 'line',
            data: calculateMA(30,data),
            smooth: true,
            symbol: "none",
            lineStyle: {
              normal: {
                opacity: 0.8,
                width: 1,
                color: ma30Color
              }
            }
          }, {
            name: 'VOL',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: data.vols,
            barWidth: '60%',
            itemStyle: {
              normal: {
                color: function(params) {
                  let colorList;
                  if (data.datas[params.dataIndex][1] > data.datas[params.dataIndex][0]) {
                    colorList = upColor;
                  } else {
                    colorList = downColor;
                  }
                  return colorList;
                },
              }
            }
          }, {
            name: 'MACD',
            type: 'bar',
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: macd.macd,
            barWidth: '40%',
            itemStyle: {
              normal: {
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
            }
          }, {
            name: 'DIF',
            type: 'line',
            symbol: "none",
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: macd.dif,
            lineStyle: {
              normal: {
                color: '#da6ee8',
                width: 1
              }
            }
          }, {
            name: 'DEA',
            type: 'line',
            symbol: "none",
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: macd.dea,
            lineStyle: {
              normal: {
                opacity: 0.8,
                color: '#39afe6',
                width: 1
              }
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
  
  //useState的set方法是异步的，当后续代码必须在state更新后执行时
  //不比在一个useEffect中写，而是新起一个useEffect并申明只有当该state刷新时才生效

  useEffect(()=>{
    console.log(1);
  })

  useEffect(()=>{
    if(dataChart === null)return;
    postRequest('kdata',{code:currStock, type:currType})
    .then((data)=>{
      const option = initKOption(data);
      dataChart.setOption(option);
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

        <div className={styles.kdata} id="kdata">

        </div>
       
    </div>
  )
}
