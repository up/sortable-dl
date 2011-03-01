###Getting started

To use the sortable-dl, include the jQuery library and the sortable-dl script and stylesheet inside the <head> tag of your HTML document:

	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
	<link rel="stylesheet" type="text/css" href="sortable-dl.css">
	<script src="sortable-dl.min.js"></script>


NOTE: sortable-dl works NOT on standard HTML tables. It used a definition list hack for hiding and showing extra information for any tablerow:

  <div class="sdl">
    <span class="sdl-info">
  	<span class="sdl-matches">0</span> Treffer auf
  	<span class="sdl-pages">0</span> Seite(n)
    </span>
    <span class="sdl-links">
      <span class="sdl-first">Erste</span>
      <span class="sdl-previous">Vorherige</span>
      <span class="sdl-number-links">&nbsp;</span>
      <span class="sdl-next">Nächste</span>
      <span class="sdl-last">Letzte</span>
    </span>
  </div>

  <table id="sortable">

    <tr class="thead">
      <td>
        <dl>
          <dt class="col1"><span>Netz</span></dt>
          <dt class="col2"><span>Tarifname</span></dt>
          <dt class="col3"><span>Highlight</span></dt>
          <dt class="col4"><span>Anschlussgebühr</span></dt>
          <dt class="col5"><span>Grundgebühr</span></dt>
          <dt class="col6"><span>Datum</span></dt>
          <dt class="col7">&nbsp;</dt>
        </dl>
      </td>
    </tr>

    <tr id="row1">
      <td>
        <dl>
          <dt class="col1">T-Mobile 1</dt>
          <dt class="col2">c-Superflat</dt>
          <dt class="col3">Blah blah</dt>
          <dt class="col4">330,00 €</dt>
          <dt class="col5">52,98 €</dt>
          <dt class="col6">0,00 €</dt>
          <dt class="col7"><a href="javascript:show(1);">details</a></dt>

          <dd class="vertragsdetails">vertragsdetails 1</dd><dd class="vertragsinfos">vertragsinfos 1</dd>
        </dl>
      </td>
    </tr>

    <tr id="row2">
      <td>
        <dl>
          <dt class="col1">T-Mobile 2</dt>
          <dt class="col2">a-Superflat</dt>
          <dt class="col3">Blah blah</dt>
          <dt class="col4">90,00 €</dt>
          <dt class="col5">12,98 €</dt>
          <dt class="col6">0,00 €</dt>
          <dt class="col7"><a href="javascript:show(2);">details</a></dt>

          <dd class="vertragsdetails">vertragsdetails 2</dd><dd class="vertragsinfos">vertragsinfos 2</dd>
        </dl>
      </td>
    </tr>

	</table>



Start by telling sortable-dl to sort your dl-table when the document is loaded:

	<script>
	$(document).ready(function() {  
	
	  var mySorter = new SortableDL();
	  mySorter.init({
	    id: 'sortable',           // Table ID
	    columns: [
	      null,                   // Col 1
	      'caseInsensitive',      // Col 2
	      'caseSensitive',        // Col 3
	      'numeric',              // Col 4  
	      'numeric',              // Col 5  
	      'date',                 // Col 6 
	      null                    // Col 7
	    ],
	    classes: {
	      asc: 'asc',             // optional - default: 'asc'
	      desc: 'desc',           // optional - default: 'desc'
	      column: 'active-column' // optional - default: ''
	    },
	    pagination: {			  // optional - default: 'no pager'
		  items: 5,               // Items per page: optional - default: 'all'
		  numbers: 5              // Visible page numbers: optional - default: 'all'
	    }
	  });  

	});
	</script>

###Sorting Options

1. caseInsensitive
2. caseSensitive
3. numeric
4. date

Sort by date accepted following date formats:

* 1298851200000 (UNIX Timestamp)
* 2011/02/28 (US Short Date Format)
* 28/02/2011 (EU Short Date Format)
* 28.02.2011 (EU Short Date Format)
* 2011-02-28T00:00:00-00:00 (ISO 8601)
* Mon Feb 28 2011 00:00:00 GMT+0000 (Javascript Default Date Format)
* Mon, 28 Feb 2011 00:00:00 GMT (Javascript GMT Date Format)
 
