// Generated by CoffeeScript 1.7.1
var Chr_Interval_Map;

Chr_Interval_Map = (function() {
  function Chr_Interval_Map(plot_height, plot_width, chr) {
    this.plot_height = plot_height;
    this.plot_width = plot_width;
    this.chr = chr;
    this.qtl_results = js_data.qtl_results;
    console.log("qtl_results are:", this.qtl_results);
    console.log("chr is:", this.chr);
    this.get_max_chr();
    this.filter_qtl_results();
    console.log("filtered results:", this.these_results);
    this.get_qtl_count();
    this.x_coords = [];
    this.y_coords = [];
    this.marker_names = [];
    console.time('Create coordinates');
    this.create_coordinates();
    console.log("@x_coords: ", this.x_coords);
    console.log("@y_coords: ", this.y_coords);
    console.timeEnd('Create coordinates');
    this.x_buffer = this.plot_width / 30;
    this.y_buffer = this.plot_height / 20;
    this.x_max = d3.max(this.x_coords);
    this.y_max = d3.max(this.y_coords) * 1.2;
    this.y_threshold = this.get_lod_threshold();
    this.svg = this.create_svg();
    this.plot_coordinates = _.zip(this.x_coords, this.y_coords, this.marker_names);
    console.log("coordinates:", this.plot_coordinates);
    this.plot_height -= this.y_buffer;
    this.create_scales();
    console.time('Create graph');
    this.create_graph();
    console.timeEnd('Create graph');
  }

  Chr_Interval_Map.prototype.get_max_chr = function() {
    var key, _results;
    this.max_chr = 0;
    _results = [];
    for (key in js_data.chromosomes) {
      console.log("key is:", key);
      if (parseInt(key) > this.max_chr) {
        _results.push(this.max_chr = parseInt(key));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Chr_Interval_Map.prototype.filter_qtl_results = function() {
    var result, this_chr, _i, _len, _ref, _results;
    this.these_results = [];
    this_chr = 100;
    _ref = this.qtl_results;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      result = _ref[_i];
      if (result.chr === "X") {
        this_chr = this.max_chr;
      } else {
        this_chr = result.chr;
      }
      console.log("this_chr is:", this_chr);
      console.log("@chr[0] is:", parseInt(this.chr[0]));
      if (this_chr > parseInt(this.chr[0])) {
        break;
      }
      if (parseInt(this_chr) === parseInt(this.chr[0])) {
        _results.push(this.these_results.push(result));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Chr_Interval_Map.prototype.get_qtl_count = function() {
    var high_qtl_count, result, _i, _len, _ref;
    high_qtl_count = 0;
    _ref = this.these_results;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      result = _ref[_i];
      if (result.lrs_value > 1) {
        high_qtl_count += 1;
      }
    }
    console.log("high_qtl_count:", high_qtl_count);
    return this.y_axis_filter = 2;
  };

  Chr_Interval_Map.prototype.create_coordinates = function() {
    var result, _i, _len, _ref, _results;
    _ref = this.these_results;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      result = _ref[_i];
      this.x_coords.push(parseFloat(result.Mb));
      this.y_coords.push(result.lrs_value);
      _results.push(this.marker_names.push(result.name));
    }
    return _results;
  };

  Chr_Interval_Map.prototype.create_svg = function() {
    var svg;
    svg = d3.select("#topchart").append("svg").attr("class", "chr_interval_map").attr("width", this.plot_width + this.x_buffer).attr("height", this.plot_height + this.y_buffer).append("g");
    return svg;
  };

  Chr_Interval_Map.prototype.create_scales = function() {
    console.log("chr[1] is:", this.chr[1]);
    this.x_scale = d3.scale.linear().domain([0, this.chr[1]]).range([this.x_buffer, this.plot_width]);
    return this.y_scale = d3.scale.linear().domain([0, this.y_max]).range([this.plot_height, this.y_buffer]);
  };

  Chr_Interval_Map.prototype.get_lod_threshold = function() {
    if (this.y_max / 2 > 2) {
      return this.y_max / 2;
    } else {
      return 2;
    }
  };

  Chr_Interval_Map.prototype.create_graph = function() {
    this.add_border();
    this.add_x_axis();
    this.add_y_axis();
    this.add_title();
    this.add_back_button();
    return this.add_path();
  };

  Chr_Interval_Map.prototype.add_border = function() {
    var border_coords;
    border_coords = [[this.y_buffer, this.plot_height, this.x_buffer, this.x_buffer], [this.y_buffer, this.plot_height, this.plot_width, this.plot_width], [this.y_buffer, this.y_buffer, this.x_buffer, this.plot_width], [this.plot_height, this.plot_height, this.x_buffer, this.plot_width]];
    return this.svg.selectAll("line").data(border_coords).enter().append("line").attr("y1", (function(_this) {
      return function(d) {
        return d[0];
      };
    })(this)).attr("y2", (function(_this) {
      return function(d) {
        return d[1];
      };
    })(this)).attr("x1", (function(_this) {
      return function(d) {
        return d[2];
      };
    })(this)).attr("x2", (function(_this) {
      return function(d) {
        return d[3];
      };
    })(this)).style("stroke", "#000");
  };

  Chr_Interval_Map.prototype.add_x_axis = function() {
    this.xAxis = d3.svg.axis().scale(this.x_scale).orient("bottom").ticks(20);
    this.xAxis.tickFormat((function(_this) {
      return function(d) {
        d3.format("d");
        return d;
      };
    })(this));
    return this.svg.append("g").attr("class", "x_axis").attr("transform", "translate(0," + this.plot_height + ")").call(this.xAxis).selectAll("text").attr("text-anchor", "right").attr("font-size", "12px").attr("dx", "-1.6em").attr("transform", (function(_this) {
      return function(d) {
        return "translate(-12,0) rotate(-90)";
      };
    })(this));
  };

  Chr_Interval_Map.prototype.add_y_axis = function() {
    this.yAxis = d3.svg.axis().scale(this.y_scale).orient("left").ticks(5);
    return this.svg.append("g").attr("class", "y_axis").attr("transform", "translate(" + this.x_buffer + ",0)").call(this.yAxis);
  };

  Chr_Interval_Map.prototype.add_title = function() {
    return this.svg.append("text").attr("class", "title").text("Chr " + this.chr[0]).attr("x", (function(_this) {
      return function(d) {
        return (_this.plot_width + _this.x_buffer) / 2;
      };
    })(this)).attr("y", this.y_buffer + 20).attr("dx", "0em").attr("text-anchor", "middle").attr("font-family", "sans-serif").attr("font-size", "18px").attr("fill", "black");
  };

  Chr_Interval_Map.prototype.add_back_button = function() {
    return this.svg.append("text").attr("class", "back").text("Return to full view").attr("x", this.x_buffer * 2).attr("y", this.y_buffer / 2).attr("dx", "0em").attr("text-anchor", "middle").attr("font-family", "sans-serif").attr("font-size", "18px").attr("cursor", "pointer").attr("fill", "black").on("click", this.return_to_full_view);
  };

  Chr_Interval_Map.prototype.add_path = function() {
    var line_function, line_graph;
    line_function = d3.svg.line().x((function(_this) {
      return function(d) {
        return _this.x_scale(d[0]);
      };
    })(this)).y((function(_this) {
      return function(d) {
        return _this.y_scale(d[1]);
      };
    })(this)).interpolate("linear");
    return line_graph = this.svg.append("path").attr("d", line_function(this.plot_coordinates)).attr("stroke", "blue").attr("stroke-width", 1).attr("fill", "none");
  };

  Chr_Interval_Map.prototype.return_to_full_view = function() {
    $('#topchart').remove();
    $('#chart_container').append('<div class="qtlcharts" id="topchart"></div>');
    return create_interval_map();
  };

  Chr_Interval_Map.prototype.show_marker_in_table = function(marker_info) {
    var marker_name;
    console.log("in show_marker_in_table");

    /* Searches for the select marker in the results table below */
    if (marker_info) {
      marker_name = marker_info[2];
      return $("#qtl_results_filter").find("input:first").val(marker_name).change();
    }
  };

  return Chr_Interval_Map;

})();