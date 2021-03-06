/**
 SortableDL
 (needs jQuery)
 
 MIT License
 
 Copyright (c) 2011 Uli Preuss
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 
 */

/*jslint onevar: true, undef: true, newcap: true, nomen: true, regexp: true, plusplus: true, bitwise: true, strict: true */
/*global $: false */

var SortableDL = (function () {

  "use strict";

  var sdl = function () {

    var cols = [],
      rows = [],
      controls = [
        ['sdl-first', 1],
        ['sdl-previous', 1],
        ['sdl-next', 2],
        ['sdl-last', null]
      ],
      classes = {
        asc: 'asc',
        desc: 'desc',
        page: 'active-page',
        dt: 'sortable-column',
        column: ''
      },
      id = '',
      pager = {
        items: null,
        numbers: null
      },
      pages = 1,
      current = {
        page: 1,
        col: 0
      },
      startsorting = false,
      starttype = 'descending',
      pp = null,
      pc = null,
      u = undefined,
      self = this;

    this.init = function (param) {
      id = param.id;
      starttype = param.first !== u ? param.first : starttype;
      pc = param.classes;
      pp = param.pagination;
      classes.asc = pc !== u && pc.asc !== u ? pc.asc : classes.asc;
      classes.desc = pc !== u && pc.desc !== u ? pc.desc : classes.desc;
      classes.column = pc !== u && pc.column !== u ? pc.column : classes.column;
      pager.items = pp !== u && pp.items !== u ? pp.items : pager.items;
      pager.numbers = pp !== u && pp.numbers !== u ? pp.numbers : pager.numbers;
      this.getRows();
      this.countPages();
      controls[3][1] = pages;
      if (pp !== u) {
        this.pagination();
      }
      this.addSortableLinks(param.columns);
      this.getData();
      this.addRows(current.col);
    };

    this.countPages = function () {
      pager.items = pager.items !== null ? pager.items : rows.length;
      pages = Math.ceil((rows.length - 1) / pager.items);
    };

    this.pagination = function () {

      $('span.sdl-matches').each(function () {
        $(this).html(rows.length - 1);
      });
      $('span.sdl-pages').each(function () {
        $(this).html(pages);
      });

      if (pages === 1) {
        $('span.sdl-links').css('display', 'none');
        return;
      }

      // BUTTONS: FIRST, PREVIOUS, NEXT, LAST
      $.each(controls, function (i) {
        $('span.' + controls[i][0]).click(function () {
          current.page = controls[i][1];
          if (current.page <= 1) {
            controls[0][1] = 1;
          }
          controls[1][1] = (current.page > 1) ? current.page - 1 : 1;
          controls[2][1] = (current.page < pages) ? current.page + 1 : pages;
          self.updatePager();
          self.addRows(current.col);
          if (classes.column !== '') {
            self.toggleColClass(current.col);
          }
        }).css('cursor', 'pointer');
      });

      self.updatePager();

    };

    this.updatePager = function () {

      var visible = 0,
        padding = pager.numbers !== null ? Math.round((pager.numbers - 1) / 2) : 0;
      pager.numbers = pager.numbers !== null ? pager.numbers : pages;

      $('span.sdl-number-links').empty();

      // console.log(rows);
      $.each(rows, function (i) {

        if (pager.numbers <= visible) {
          return;
        }

        if (
             (
               pager.numbers === null || 
               (i <= pager.numbers && i >= current.page - padding) || 
               (i < pages - pager.numbers + padding + 1 && i > pages - pager.numbers && i <= current.page + padding) || 
               (i >= current.page - padding && i <= current.page + padding)
              ) && (i !== 0 && i <= pages)
        ) {
          visible += 1;
          $('span.sdl-number-links').append('<span title="' + i + '">' + i + '</span> ');
        }

      });

      // PAGES NUMBERS
      $('span.sdl-number-links > span').each(function (i) {
        $(this).click(function () {
          if (parseInt($(this).attr("title"), 10) === current.page) {
            return;
          }
          current.page = parseInt($(this).attr("title"), 10);
          controls[1][1] = (current.page > 1) ? current.page - 1 : 1;
          controls[2][1] = (current.page < pages) ? current.page + 1 : pages;
          self.updatePager();
          self.addRows(current.col);
          if (classes.column !== '') {
            self.toggleColClass(current.col);
          }
        }).css('cursor', 'pointer');
      });

    };

    this.getData = function () {
      $('#' + id + ' tr dl').each(function (col) {
        if (col !== 0) {
          $(this).children('dt').each(function (i) {
            cols[i].push([$(this).text(), rows[col]]);
          });
        }
      });
    };

    this.addSortableLinks = function (arr) {
      $('#' + id + ' thead dt').each(function (col) {
        cols[col] = [];
        if (arr[col] !== null) {
          $(this).click(function () {
            self.sort(col, arr[col]);
            self.toggleClass(col, $(this));
          })
          .addClass(classes.dt)
          .css('cursor', 'pointer');
        }
      });
    };

    this.sort = function (i, type) {

      startsorting = true;

      cols[i].sort(function (a, b) {

        if (type === 'caseSensitive') {
          a = a[0];
          b = b[0];
        } else if (type === 'caseInsensitive') {
          a = a[0].toUpperCase();
          b = b[0].toUpperCase();
        } else if (type === 'numeric') {
          a = parseFloat(a[0]);
          a = isNaN(a) ? 0 : a;
          b = parseFloat(b[0]);
          b = isNaN(b) ? 0 : b;
        } else if (type === 'date') {
          a = self.unixTimestamp(a[0]);
          b = self.unixTimestamp(b[0]);
        }

        if (self.isASC($('thead dt:eq(' + i + ')'))) {
          return (a < b) ? -1 : (a > b) ? 1 : 0;
        } else {
          return (a > b) ? -1 : (a < b) ? 1 : 0;
        }
      });
      self.addRows(i);
      current.col = i;
    };

    this.unixTimestamp = function (input) {

      var msecs, pos = function (a, b) {
        if (typeof input === 'string') {
          return input.substring(a, b);
        }
        return 0;
      },
        tz_msecs = (pos(19, 20) + ((pos(20, 22) * 60) + pos(23, 25))) * 60000;

      if (typeof input === 'number' || input === parseInt(input, 10)) {
        return input;
      } else if (typeof input === 'string' && (pos(3, 4) === ' ' || pos(3, 4) === ',')) {
        return new Date(input).getTime();
      } else {
        
        if (
          (pos(4, 5) === '/' && pos(7, 8) === '/') || 
          (pos(4, 5) === '-' && pos(7, 8) === '-')
        ) {
          msecs = Date.UTC(pos(0, 4), pos(5, 7) - 1, pos(8, 10), pos(11, 13), pos(14, 16), pos(17, 19));
        } else if (
          (pos(2, 3) === '/' && pos(5, 6) === '/') || 
          (pos(2, 3) === '.' && pos(5, 6) === '.')
        ) {
          msecs = Date.UTC(pos(6, 10), pos(3, 5) - 1, pos(0, 2), pos(11, 13), pos(14, 16), pos(17, 19));
        }

        return msecs - tz_msecs;
      }

    };

    this.toggleColClass = function (col) {

      if (startsorting === false) {
        return;
      }

      var elems = $('#' + id + ' tr dt').nextAll(),
        count = elems.length - 1;

      elems.each(function (i) {
        if ($(this).hasClass(classes.column)) {
          $(this).removeClass(classes.column);
        }
        if (i === count) {
          $('#' + id + ' tr dt.col' + (parseInt(col, 10) + 1)).each(function () {
            if ($(this).parents('tbody')) {
              $(this).addClass(classes.column);
            }
          });
        }
      });

    };
    this.toggleClass = function (col, tr) {

      $('#' + id + ' thead dt').each(function (i) {
        if (col === i) {
          if (!tr.hasClass(classes.asc)) {
            tr.addClass(classes.asc);
            if (tr.hasClass(classes.desc)) {
              tr.removeClass(classes.desc);
            }
          } else {
            tr.addClass(classes.desc);
            if (tr.hasClass(classes.asc)) {
              tr.removeClass(classes.asc);
            }
          }
        } else {
          $(this).removeClass(classes.asc + ' ' + classes.desc);
        }
      });

      if (classes.column !== '') {
        self.toggleColClass(col);
      }

    };

    this.isASC = function (th) {
      if (starttype === 'descending') {
        return th.hasClass(classes.asc);
      } else if (starttype === 'ascending') {
        return !th.hasClass(classes.asc);
      }
    };

    this.getRows = function () {
      $('#' + id + ' tr').each(function (i) {
        rows[i] = $(this);
      });
    };

    this.addRows = function (i) {
      var from = (current.page - 1) * pager.items,
        to = from + pager.items;
      
      self.removeRows();
      $.each(cols[i], function (k, row) {

        if (k >= from && k < to) {
          $('#' + id).append(row[1]);
        }

      });
      $('span.sdl-number-links > span').removeClass(classes.page);
      $('span.sdl-number-links > span').each(function () {
        if (parseInt($(this).attr("title"), 10) === current.page) {
          $(this).attr("class", classes.page);
        }
      });
    };

    this.removeRows = function () {
      $('#' + id + ' tr').each(function (i) {
        if (i > 0) {
          $(this).remove();
        }
      });
    };

  };

  return sdl;

} ());
