var init = [
  {
    year: 1968,
    uk: 0
  },
  {
    year: 1973,
    uk: 0
  }
];

$(function() {
  
  var graph = GroupedBarChart()
                .width(800)
                .x(function(d) {return d.year})
                .y(function(d) {return [{uk: +d.uk}]})
                .showLegend(true);
                
  var graph2 = LineChart()
                .indy('year')
                .y('population')
                .yLabel('CO2 Emissions (kt)')
                .height(580)
                .xLabel('Year');
                
                
  var united = MapPlot()
                .lat('lat')
                .lon('lon')
                .iden('name')
                .width(600)
                .height(600);
                
  var world = WorldMap()
                .unit('country')
                .ratio('temp')
                .width(700)
                .height(600);
              
                
  var engaged = false;
  
  // Instantiate your chart with given settings
  var chartWrapper = d3.select('#vis');
  
  function showVis() {
    d3.select('#vis')
      .transition()
      .duration(1500)
      .style('opacity', 1.0);
  }
    
  function hideVis() {
    d3.select('#vis')
      .transition()
      .duration(0)
      .style('opacity', 0);
  }
  
  var updateBar = function(index, val, data) {
      switch(index) {
        case 10:
          graph.yLabel('population');
          showVis();
          var yVal = val;
          break;
        case 11:
          graph.yLabel('population');
          showVis();
          var yVal = val;
          break;
        case 12:
          graph.yLabel('population');
          showVis();
          var yVal = val;
          break;
        case 13:
          showVis();
          graph.yLabel('Population');
          var yVal = val;
          break;
      }
      graph.y(val).xLabel('Year');
      chartWrapper.datum([data]).call(graph);
      showVis();
    };
    
    //determine which data to grab
    var getData = function(index) {
        if (index <= 4) {
          surface(index);
        } else if (index <= 8) {
          carbon(index);
        } else if (index <= 12) {
          pop(index);
        } else if (index <= 16) {
          rate(index);
        } else if (index <= 20) {
          death(index);
        } else if (index <= 22){
          birds(index);
        } else {
          hideVis();
          $('#vis').empty();
        }
    };
    
    //handles surface temp data
    var surface = function(index) {
      d3_queue.queue()
        .defer(d3.json, 'json/borders/boundaries.json')
        .defer(d3.csv, 'data/temp.csv')
        .await(function(error, map, data) {
          switch(index) {
            case 0:
              break;
            case 1:
              if (engaged) {
                $('#vis').empty();
              }
              engaged = true;
              showVis();
              world.map(map);
              chartWrapper.datum(data).call(world);
              break;
            case 2:
              showVis();
              engaged = false;
              world.map(map);
              chartWrapper.datum(data).call(world);
              break;
            case 3:
              showVis();
              world.map(map);
              chartWrapper.datum(data).call(world);
              break;
            case 4:
              if (engaged) {
                $('#vis').empty();
              }
              engaged = true;
              showVis();
              world.map(map);
              chartWrapper.datum(data).call(world);
              break;
          }
        });
    };
    
    //handles carbon emission data
    var carbon = function(index) {
      d3.csv('data/emission/co2.csv', function(data) {
        switch(index) {
          case 5:
            if (engaged) {
              $('#vis').empty();
            }
            graph2.yLabel('CO2 Emissions (kt)');
            data.filter(function(d) {return objFilter1(d)});
            chartWrapper.datum(data).call(graph2);
            showVis();
            engaged = true;
            break;
          case 6:
            graph2.yLabel('CO2 Emissions (kt)');
            engaged = false;
            showVis();
            data.filter(function(d) {return objFilter2(d)});
            chartWrapper.datum(data).call(graph2);
            break;
          case 7:
            showVis();
            graph2.yLabel('CO2 Emissions (kt)');
            data.filter(function(d) {return objFilter3(d)});
            chartWrapper.datum(data).call(graph2);
            break;
          case 8:
            if (engaged) {
              $('#vis').empty();
            }
            engaged = true;
            graph2.yLabel('CO2 Emissions (kt)');
            showVis();
            graph2.scaleMax(false);
            data.filter(function(d) {return objFilter3(d)});
            chartWrapper.datum(data).call(graph2);
            break;
        }
      });
    };
    
    var pop = function(index) {
      d3.csv('data/population/population.csv', function(data) {
        switch(index) {
          case 9:
            if (engaged) {
              $('#vis').empty();
            }
            showVis();
            var yVal = function(d) {
              return [{uk: +d.uk}];
            };
            updateBar(index, yVal, data);
            engaged = true;
            break;
          case 10:
            engaged = false;
            showVis();
            var yVal = function(d) {
              return [
                {uk: +d.uk},{japan: +d.japan}];
            };
            updateBar(index, yVal, data);
            break;
          case 11:
            showVis();
            var yVal = function(d) {
              return [
                {uk: +d.uk},{japan: +d.japan},{us: +d.us},{india: +d.india},{china: +d.china}];
            };
            updateBar(index, yVal, data);
            break;
          case 12:
            if (engaged) {
              $('#vis').empty();
            }
            engaged = true;
            showVis();
            var yVal = function(d) {
              return [
                {uk: +d.uk},{japan: +d.japan},{us: +d.us},{india: +d.india},{china: +d.china}];
            };
            updateBar(index, yVal, data);
            break;
        }
      });
    };
    
    var rate = function(index) {
      d3.csv('data/birth/birth.csv', function(data) {
        switch(index) {
          case 13:
            if (engaged) {
              $('#vis').empty();
            }
            engaged = true;
            graph2.yLabel('Birth Rate (per 1000 people)');
            graph2.scaleMax(true);
            graph2.scaleLock(39);
            data.filter(function(d) {return objFilter1(d)});
            chartWrapper.datum(data).call(graph2);
            showVis();
            break;
          case 14:
            engaged = false;
            showVis();
            graph2.yLabel('Birth Rate (per 1000 people)');
            data.filter(function(d) {return objFilter2(d)});
            chartWrapper.datum(data).call(graph2);
            break;
          case 15:
            showVis();
            graph2.yLabel('Birth Rate (per 1000 people)');
            data.filter(function(d) {return objFilter3(d)});
            chartWrapper.datum(data).call(graph2);
            break;
          case 16:
            if (engaged) {
              $('#vis').empty();
            }
            engaged = true;
            graph2.yLabel('Birth Rate (per 1000 people)');
            data.filter(function(d) {return objFilter3(d)});
            chartWrapper.datum(data).call(graph2);
            showVis();
            break;
        }
      });
    };
    
    var death = function(index) {
      d3.csv('data/death/death.csv', function(data) {
        switch(index) {
          case 17:
            if (engaged) {
              $('#vis').empty();
            }
            engaged = true;
            graph2.yLabel('Death Rate (per 1000 people)');
            data.filter(function(d) {return objFilter1(d)});
            chartWrapper.datum(data).call(graph2);
            showVis();
            break;
          case 18:
            engaged = false;
            showVis();
            graph2.yLabel('Death Rate (per 1000 people)');
            data.filter(function(d) {return objFilter2(d)});
            chartWrapper.datum(data).call(graph2);
            break;
          case 19:
            showVis();
            graph2.yLabel('Death Rate (per 1000 people)');
            data.filter(function(d) {return objFilter3(d)});
            chartWrapper.datum(data).call(graph2);
            break;
          case 20:
            if (engaged) {
              $('#vis').empty();
            }
            engaged = true;
            graph2.yLabel('Death Rate (per 1000 people)');
            data.filter(function(d) {return objFilter3(d)});
            chartWrapper.datum(data).call(graph2);
            showVis();
            break;
        }
      });
    };
    
    var birds = function(index) {
      d3_queue.queue()
        .defer(d3.json, 'json/us.json')
        .defer(d3.csv, 'data/birds/winter66avg.csv')
        .defer(d3.csv, 'data/birds/winter05avg.csv')
        .await(function(error, map, pos1, pos2) {
          switch(index) {
            case 21:
              if (engaged) {
                $('#vis').empty();
              }
              engaged = true;
              united.map(map);
              chartWrapper.datum(pos1).call(united);
              showVis();
              break;
            case 22:
              engaged = false;
              united.map(map);
              showVis();
              chartWrapper.datum(pos2).call(united);
              break;
          }
        })
    };
    
    function objFilter1(obj) {
      for (var i in obj) {
        if (i !== 'us' && i !== 'year') 
          delete obj[i];
      }
      return obj;
    }
    
    function objFilter2(obj) {
      for (var i in obj) {
        if (i !== 'us' && i !== 'year' && i !== 'china') 
          delete obj[i];
      }
    }
    
    function objFilter3(obj) {
      for (var i in obj) {
        if (i !== 'us' && i !== 'year' && i !== 'china' && i !== 'india' && i !== 'japan' && i !== 'uk') 
          delete obj[i];
      }
    }
    
  // Define a new scroller, and use the `.container` method to specify the desired container
  var scroll = scroller()
      .container(d3.select('#graphic'));

  // Pass in a selection of all elements that you wish to fire a step event:
  scroll(d3.selectAll('.step')); // each section with class `step` is a new step

  // Specify the function you wish to activate when a section becomes active
  scroll.on('active', function(index) {
    getData(index);
  });
  
});