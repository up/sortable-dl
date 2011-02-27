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
    
    var dataCols = [],
    controls = [
      ['sdl-first', 1], 
      ['sdl-previous', 1], 
      ['sdl-next', 2], 
      ['sdl-last', null] 
    ],
    dataRows = [],
    classes = {
      asc: 'asc',
      desc: 'desc',
      column: ''
    },
    tableId = '',
    pager = {
      items: null,
      numbers: null
    },
    pages = 1,
    current_page = 1,
    current_column = 0,
    pc = null,
    pp = null,
    u = undefined,
    self = this;

    this.init = function (param) {
      tableId = param.id;
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
      this.addRows(current_column);
    };

    this.countPages = function () {
      pager.items = pager.items !== null ? pager.items : dataRows.length;
      pages = Math.ceil((dataRows.length-1)/pager.items);
    };

    this.pagination = function () {
      
      $('span.sdl-matches').each(function () {
        $(this).html(dataRows.length-1);
      });
      $('span.sdl-pages').each(function () {
        $(this).html(pages);
      });
           
      if(pages === 1) {
        $('span.sdl-links').css('display', 'none');
        return;
      }

      // BUTTONS: FIRST, PREVIOUS, NEXT, LAST
       $.each(controls, function (i) {
         $('span.' + controls[i][0]).click(function () {
           current_page = controls[i][1];
           if(current_page <= 1) {controls[0][1] = 1;}
           controls[1][1] = (current_page > 1) ? current_page - 1 : 1;
           controls[2][1] = (current_page < pages) ? current_page + 1 : pages;
           self.updatePager();
           self.addRows(current_column);
           if (classes.column !== '') {
             self.toggleColClass (current_column);
           };
           
         })
         .css('cursor', 'pointer');
       });

      self.updatePager();
       
    };

    this.updatePager = function () {
      
      var padding = pager.numbers !== null ? Math.round((pager.numbers-1)/2) : 0;
      pager.numbers = pager.numbers !== null ? pager.numbers : pages;
      var visible = 0;

      $('span.sdl-number-links').empty();
      
      // console.log(dataRows);
      $.each(dataRows, function (i) {
        
        if(pager.numbers <= visible){ return; }
        
        if(
          pager.numbers === null || 
          (i <= pager.numbers && i >= current_page - padding) || 
          (i < pages - pager.numbers + padding + 1 && i > pages - pager.numbers && i <= current_page + padding) || 
         (i >= current_page - padding && i <= current_page + padding)
        ) {
          if(i !== 0 && i <= pages) {
            visible++;
            $('span.sdl-number-links').append(
              '<span title="' + i + '">' + i + '</span> '
            );
          }
        }

      });

      // PAGES NUMBERS
      $('span.sdl-number-links > span').each(function (i) {
          $(this)
          .click(function () {
            if(parseInt($(this).attr("title"), 10) === current_page) { return; }
            current_page = parseInt($(this).attr("title"), 10);
            controls[1][1] = (current_page > 1) ? current_page - 1 : 1;
            controls[2][1] = (current_page < pages) ? current_page + 1 : pages;
            self.updatePager();
            self.addRows(current_column);
            if (classes.column !== '') {
              self.toggleColClass (current_column);
            };
          })
          .css('cursor', 'pointer');
      });

    };
    
    this.getData = function () {
      $('#' + tableId + ' tr dl').each(function (col) {
        if (col !== 0) {
          $(this).children('dt').each(function (i) {
            dataCols[i].push([$(this).text(), dataRows[col]]);
          });
        }
      });
    };

    this.addSortableLinks = function (arr) {
      $('#' + tableId + ' tr.thead dt').each(function (col) {
        dataCols[col] = [];
        if(arr[col] !== null) {
          $(this).click(function () {
            self.toggleClass(col, $(this));
            self.sort(col, arr[col]);
          })  
          .addClass('sortable-column')
          .css('cursor', 'pointer');
        }
      });
    };

    this.sort = function (i, type) {
      dataCols[i].sort(function (a, b) {

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
        }

        if (self.isASC($('tr.thead dt:eq(' + i + ')'))) {
          return (a < b) ? -1 : (a > b) ? 1 : 0;
        } else {
          return (a > b) ? -1 : (a < b) ? 1 : 0;
        }
      });
      self.addRows(i);
      current_column = i;
    };

    this.toggleColClass = function (col) {
 
      $('#' + tableId + ' tr dt').each(function () {
        if($(this).hasClass(classes.column)) { 
          $(this).removeClass(classes.column);
        }
      });
      // TODO: change timeout to callback !!!
      setTimeout(function(){
          $('#' + tableId + ' tr dt.col' + (parseInt(col, 10) + 1)).each(function () {
            if(!$(this).parents('tr').hasClass('thead')) {
              $(this).addClass(classes.column);
            }
          });       
      }, 200);

    };
    this.toggleClass = function (col, tr) {
 
       $('#' + tableId + ' tr.thead dt').each(function (i) {
        if(col === i) {
          if (!tr.hasClass(classes.asc)) {
            tr.addClass(classes.asc);
            if(tr.hasClass(classes.desc)) {tr.removeClass(classes.desc);}
          } else {
            tr.addClass(classes.desc);
            if(tr.hasClass(classes.asc)) {tr.removeClass(classes.asc);}
          }
        }
        else {
          $(this).removeClass(classes.asc + ' ' + classes.desc);
        }
      });
      
      if (classes.column !== '') {
        self.toggleColClass (col);
      };
      
    };
    
    this.isASC = function (th) {
      return th.hasClass(classes.asc);
    };

    this.getRows = function () {
      $('#' + tableId + ' tr').each(function (i) {
        dataRows[i] = $(this);
      });	
    };

    this.addRows = function (i) {

      var from = (current_page-1) * pager.items;
      var to = from + pager.items;
      self.removeRows();
      $.each(dataCols[i], function (k, row) {
        
        if(k >= from &&  k < to) {
            $('#' + tableId).append(row[1]);        
        }
        
      });
      $('span.sdl-number-links > span').removeClass("active-page");
      $('span.sdl-number-links > span').each(function () {
        if(parseInt($(this).attr("title"), 10) === current_page) {
          $(this).attr("class", "active-page");
        }
      });
    };
    
    this.removeRows = function () {
      $('#' + tableId + ' tr').each(function (i) {
        if (i > 0) {
          $(this).remove();
        }
      });
    };
    
  };
  
  return sdl;
   
}());
