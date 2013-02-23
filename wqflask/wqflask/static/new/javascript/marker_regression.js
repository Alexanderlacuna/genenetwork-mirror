// Generated by CoffeeScript 1.4.0
(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $(function() {
    var Manhattan_Plot;
    Manhattan_Plot = (function() {

      function Manhattan_Plot(plot_height, plot_width) {
        var _ref;
        this.plot_height = plot_height;
        this.plot_width = plot_width;
        this.qtl_results = js_data.qtl_results;
        this.chromosomes = js_data.chromosomes;
        this.total_length = 0;
        this.max_chr = this.get_max_chr();
        this.x_coords = [];
        this.y_coords = [];
        this.marker_names = [];
        this.create_coordinates();
        _ref = this.get_chr_lengths(), this.chr_lengths = _ref[0], this.cumulative_chr_lengths = _ref[1];
        this.x_buffer = this.plot_width / 30;
        this.y_buffer = this.plot_height / 20;
        this.x_max = this.total_length;
        this.y_max = d3.max(this.y_coords) * 1.2;
        this.svg = this.create_svg();
        this.plot_coordinates = _.zip(this.x_coords, this.y_coords, this.marker_names);
        this.plot_height -= this.y_buffer;
        this.create_scales();
        this.create_graph();
      }

      Manhattan_Plot.prototype.get_max_chr = function() {
        var chr, max_chr, result, _i, _len, _ref;
        max_chr = 0;
        _ref = this.qtl_results;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          result = _ref[_i];
          chr = parseInt(result.chr);
          console.log("foo:", chr, typeof chr);
          if (!_.isNaN(chr)) {
            if (chr > max_chr) {
              max_chr = chr;
            }
          }
        }
        return max_chr;
      };

      Manhattan_Plot.prototype.get_chr_lengths = function() {
        /*
                    Gets a list of both individual and cumulative (the position of one on the graph
                    is its own length plus the lengths of all preceding chromosomes) lengths in order
                    to draw the vertical lines separating chromosomes and the chromosome labels
        */

        var chr_lengths, cumulative_chr_lengths, key, this_length, total_length;
        cumulative_chr_lengths = [];
        chr_lengths = [];
        total_length = 0;
        for (key in this.chromosomes) {
          this_length = this.chromosomes[key];
          chr_lengths.push(this_length);
          cumulative_chr_lengths.push(total_length + this_length);
          total_length += this_length;
        }
        console.log("total length is:", total_length);
        return [chr_lengths, cumulative_chr_lengths];
      };

      Manhattan_Plot.prototype.create_coordinates = function() {
        var chr_length, chr_lengths, chr_seen, result, _i, _len, _ref, _ref1;
        chr_lengths = [];
        chr_seen = [];
        _ref = js_data.qtl_results;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          result = _ref[_i];
          chr_length = this.chromosomes[result.chr];
          if (!(_ref1 = result.chr, __indexOf.call(chr_seen, _ref1) >= 0)) {
            chr_seen.push(result.chr);
            chr_lengths.push(chr_length);
            if (result.chr !== "1") {
              this.total_length += chr_lengths[chr_lengths.length - 2];
              console.log("total_length is:", this.total_length);
            }
          }
          this.x_coords.push(this.total_length + parseFloat(result.Mb));
          this.y_coords.push(result.lod_score);
          this.marker_names.push(result.name);
        }
        this.total_length += chr_lengths[chr_lengths.length - 1];
        console.log("total length is", this.total_length);
        return console.log("chr_lengths are:", chr_lengths);
      };

      Manhattan_Plot.prototype.show_marker_in_table = function(marker_info) {
        /* Searches for the select marker in the results table below
        */

        var marker_name;
        if (marker_info) {
          marker_name = marker_info[2];
        } else {
          marker_name = "";
        }
        return $("#qtl_results_filter").find("input:first").val(marker_name).keyup();
      };

      Manhattan_Plot.prototype.create_svg = function() {
        var svg;
        svg = d3.select("#manhattan_plots").append("svg").attr("width", this.plot_width).attr("height", this.plot_height);
        return svg;
      };

      Manhattan_Plot.prototype.create_graph = function() {
        this.add_border();
        this.add_y_axis();
        this.add_chr_lines();
        return this.add_plot_points();
      };

      Manhattan_Plot.prototype.add_border = function() {
        var border_coords,
          _this = this;
        border_coords = [[this.y_buffer, this.plot_height, this.x_buffer, this.x_buffer], [this.y_buffer, this.plot_height, this.plot_width, this.plot_width], [this.y_buffer, this.y_buffer, this.x_buffer, this.plot_width], [this.plot_height, this.plot_height, this.x_buffer, this.plot_width]];
        return this.svg.selectAll("line").data(border_coords).enter().append("line").attr("y1", function(d) {
          return d[0];
        }).attr("y2", function(d) {
          return d[1];
        }).attr("x1", function(d) {
          return d[2];
        }).attr("x2", function(d) {
          return d[3];
        }).style("stroke", "#000");
      };

      Manhattan_Plot.prototype.create_scales = function() {
        console.log("plot_width is: ", this.plot_width);
        this.x_scale = d3.scale.linear().domain([0, d3.max(this.x_coords)]).range([this.x_buffer, this.plot_width]);
        return this.y_scale = d3.scale.linear().domain([0, this.y_max]).range([this.plot_height, this.y_buffer]);
      };

      Manhattan_Plot.prototype.add_y_axis = function() {
        var yAxis;
        yAxis = d3.svg.axis().scale(this.y_scale).orient("left").ticks(5);
        return this.svg.append("g").attr("class", "axis").attr("transform", "translate(" + this.x_buffer + ",0)").call(yAxis);
      };

      Manhattan_Plot.prototype.add_chr_lines = function() {
        var _this = this;
        return this.svg.selectAll("line").data(this.cumulative_chr_lengths, function(d) {
          return d;
        }).enter().append("line").attr("x1", this.x_scale).attr("x2", this.x_scale).attr("y1", this.y_buffer).attr("y2", this.plot_height).style("stroke", "#ccc");
      };

      Manhattan_Plot.prototype.add_chr_labels = function() {
        var _this = this;
        return this.svg.selectAll("text").data(_.zip(this.chr_lengths, this.cumulative_chr_lengths), function(d) {
          var chr, label_positions, _i, _len;
          label_positions = [];
          for (_i = 0, _len = d.length; _i < _len; _i++) {
            chr = d[_i];
            label_positions.push(chr[1] - chr[0] / 2);
          }
          return label_positions;
        }).enter().append("text");
      };

      Manhattan_Plot.prototype.add_plot_points = function() {
        var _this = this;
        console.log("x_max is:", this.x_max);
        return this.svg.selectAll("circle").data(this.plot_coordinates).enter().append("circle").attr("cx", function(d) {
          return _this.x_buffer + ((_this.plot_width - _this.x_buffer) * d[0] / _this.x_max);
        }).attr("cy", function(d) {
          return _this.plot_height - ((_this.plot_height - _this.y_buffer) * d[1] / _this.y_max);
        }).attr("r", 2).classed("circle", true).on("mouseover", function(d) {
          return d3.select(d3.event.target).classed("d3_highlight", true).attr("r", 5).attr("fill", "yellow").call(_this.show_marker_in_table(d));
        }).on("mouseout", function() {
          return d3.select(d3.event.target).classed("d3_highlight", false).attr("r", 2).attr("fill", "black").call(_this.show_marker_in_table());
        });
      };

      return Manhattan_Plot;

    })();
    return new Manhattan_Plot(600, 1200);
  });

}).call(this);
