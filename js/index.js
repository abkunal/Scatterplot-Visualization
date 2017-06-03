d3.json(
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json",
  function(dataset) {
    console.log(dataset.length);

    // height, width and margin of the svg
    var margin = { top: 20, right: 20, bottom: 20, left: 20 };
    var w = 800;
    var h = 400 - margin.top;

    // finishing time of all players
    var time = [];
    for (var i = 0; i < dataset.length; i++) {
      var date = new Date();
      console.log(dataset[i].Time);
      date.setMinutes(dataset[i].Time.substr(0, 2));
      date.setSeconds(dataset[i].Time.substr(3, 5));
      time.push(date);
    }

    var lastdate = new Date();
    lastdate.setMinutes(36);
    lastdate.setSeconds(30);
    time.push(lastdate);

    // tooltip code
    var tip = d3
      .tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return (
          "<p>" +
          d.Name +
          ":" +
          d.Nationality +
          "<br>Year" +
          d.Year +
          ", Time: " +
          d.Time +
          "<br><br> " +
          d.Doping +
          "</p>"
        );
      });

    // scale for X-Axis
    var xScale = d3.time
      .scale()
      .domain([d3.min(time), d3.max(time)])
      .range([60, w - margin.right]);

    // scale for Y-Axis
    var yScale = d3.scale
      .linear()
      .domain([1, dataset.length + 3])
      .range([margin.bottom, h - margin.top]);

    // Inserting svg into our html
    var svg = d3
      .select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", h + 100);

    svg.call(tip);

    // drawing scatterplots
    svg
      .selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("class", "circle")
      .attr("cx", function(d, i) {
        return xScale(time[i]);
      })
      .attr("cy", function(d, i) {
        return yScale(parseInt(d.Place));
      })
      .attr("r", 5)
      .attr("fill", function(d) {
        if (d.Doping === "") return "green";
        else return "crimson";
      })
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);

    // placing X-Axis
    var xAxis = d3.svg
      .axis()
      .scale(xScale)
      .orient("bottom")
      .ticks(5)
      .tickFormat(d3.time.format("%M:%S"));

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + 0 + "," + (h - margin.bottom) + ")")
      .call(xAxis);

    // placing Y-Axis
    var yAxis = d3.svg.axis().scale(yScale).orient("left");

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + 60 + "," + 0 + ")")
      .call(yAxis);

    // X-Axis label
    svg
      .append("text")
      .attr("x", w / 2 - 30)
      .attr("y", h + 30)
      .text("Finishing Time");

    // Y-Axis label
    svg
      .append("text")
      .attr("transform", "translate(15, " + (h / 2 + 10) + ")rotate(-90)")
      .text("Ranking");

    // Scale for doping allegations
    svg
      .append("circle")
      .attr("cx", 100)
      .attr("cy", 150)
      .attr("r", 5)
      .attr("fill", "crimson");

    svg.append("text").attr("x", 130).attr("y", 155).text("doping allegations");

    // scale for no doping allegations
    svg
      .append("circle")
      .attr("cx", 100)
      .attr("cy", 170)
      .attr("r", 5)
      .attr("fill", "green");

    svg
      .append("text")
      .attr("x", 130)
      .attr("y", 175)
      .text("No doping allegations");
  }
);