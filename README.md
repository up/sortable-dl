##SortableDL

There are a few excellent plugins for jQuery for Table sorting. But none offers an option for extra content ('more information ..'), hidden per default and with valid Markup. SortableDL uses standard tables with a little 'Markup Hack'. 

Instead:

	<tr>
	  <td class="col1"></td>
	  <td class="col2"></td>
	  <td class="col3"></td>
	</tr>

we take Definition List Elements for columns:

	<tr>
	  <td>
	    <dl>
	      <dt class="col1"></dt>
	      <dt class="col2"></dt>
	      <dt class="col3"></dt>
	    </dl>
	  </td>
	</tr>

Now we can add DD element(s) for the extra content (hidden per default) :

	<tr>
	  <td>
	    <dl>
	      <dt class="col1"></dt>
	      <dt class="col2"></dt>
	      <dt class="col3"></dt>
	      <dd>additional content</dd>
	      <dd>more additional content</dd>
	    </dl>
	  </td>
	</tr>


###Getting started

To use the sortable-dl, include the jQuery library and the sortable-dl script and stylesheet inside the &lt;head> tag of your HTML document:

	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
	<link rel="stylesheet" type="text/css" href="sortable-dl.css">
	<script src="sortable-dl.min.js"></script>


NOTE: sortable-dl works NOT on standard HTML tables (more than one table cell in row). As described before, it used a definition list hack for hiding and showing extra information for any table row:

  <table id="sortable">
    <thead>
      <tr>
        <td>
          <dl>
            <dt class="col1"><span class="pad"><span>Row #</span></span></dt>
            <dt class="col2"><span class="pad"><span>Track</span></span></dt>
            <dt class="col3"><span class="pad"><span>Interpret</span></span></dt>
            <dt class="col4"><span class="pad"><span>Genre</span></span></dt>
            <dt class="col5"><span class="pad"><span>Price</span></span></dt>
            <dt class="col6"><span class="pad"><span>Release</span></span></dt>
            <dt class="col7"><span class="pad">&nbsp;</span></dt>
          </dl>
        </td>
      </tr>
    </thead>
    <tbody>
    <tr id="row1">
      <td>
        <dl>
          <dt class="col1"><span class="pad">1</span></dt>
          <dt class="col2"><span class="pad">Awful Thing</span></dt>
          <dt class="col3"><span class="pad">Cee-Lo</span></dt>
          <dt class="col4"><span class="pad">R'n'B</span></dt>
          <dt class="col5"><span class="pad">1.99 €</span></dt>
          <dt class="col6"><span class="pad">28.02.2002</span></dt>
          <dt class="col7"><span class="pad"><a href="javascript:show(1);">Details</a></span></dt>

          <dd class="sdl-details">
            <span class="pad">
              <h2>Details (1)</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sodales facilisis augue, sed suscipit velit aliquam non. Morbi egestas ultricies leo, sit amet luctus mi imperdiet convallis. Nam sit amet arcu id lorem blandit interdum non id velit. Donec velit justo, imperdiet sit amet sollicitudin vitae, hendrerit non erat. Sed vitae mi malesuada urna accumsan lacinia sit amet et diam. Pellentesque at viverra tellus.</p>
              <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce erat enim, scelerisque at vestibulum sed, ultrices eget turpis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec accumsan leo sed turpis luctus vitae condimentum justo imperdiet. Aenean cursus nunc ac enim pellentesque convallis varius felis condimentum. Maecenas non augue in risus lacinia mollis.</p>
            </div>
          </dd>
        </dl>
      </td>
    </tr>
    <tr id="row2">
      <td>
        <dl>
          <dt class="col1"><span class="pad">2</span></dt>
          <dt class="col2"><span class="pad">Weather Storm</span></dt>
          <dt class="col3"><span class="pad">Craig Armstrong</span></dt>
          <dt class="col4"><span class="pad">Ambient</span></dt>
          <dt class="col5"><span class="pad">0.98 €</span></dt>
          <dt class="col6"><span class="pad">28.01.2010</span></dt>
          <dt class="col7"><span class="pad"><a href="javascript:show(2);">Details</a></span></dt>

          <dd class="sdl-details">
            <span class="pad">
              <h2>Details (2)</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sodales facilisis augue, sed suscipit velit aliquam non. Morbi egestas ultricies leo, sit amet luctus mi imperdiet convallis. Nam sit amet arcu id lorem blandit interdum non id velit. Donec velit justo, imperdiet sit amet sollicitudin vitae, hendrerit non erat. Sed vitae mi malesuada urna accumsan lacinia sit amet et diam. Pellentesque at viverra tellus.</p>
              <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce erat enim, scelerisque at vestibulum sed, ultrices eget turpis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec accumsan leo sed turpis luctus vitae condimentum justo imperdiet. Aenean cursus nunc ac enim pellentesque convallis varius felis condimentum. Maecenas non augue in risus lacinia mollis.</p>
            </div>
          </dd>
        </dl>
      </td>
    </tr>
	</tbody>
	</table>


Start by creating a new instance of SortableDL and init with your options to sort the table when the document is loaded:

	<script>
	$(document).ready(function() {  
	
	  var mySorter = new SortableDL();
	  mySorter.init({
	    id: 'sortable',           // Table ID
	    first: 'ascending',       // optional / default 'descending'
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

Sort by date accepts following date formats:

* 1298851200000 (UNIX Timestamp)
* 2011/02/28 (US Short Date Format)
* 28/02/2011 (EU Short Date Format)
* 28.02.2011 (EU Short Date Format)
* 2011-02-28T00:00:00-00:00 (ISO 8601 Date Format)
* Mon Feb 28 2011 00:00:00 GMT+0000 (Javascript Default Date Format)
* Mon, 28 Feb 2011 00:00:00 GMT (Javascript GMT Date Format)
 

###Pager

You can create multiple pagers (normally at the top and bottom of the sortable table) with the following HTML fragment:

  <div class="sdl">
    <span class="sdl-info">
  	<span class="sdl-matches">0</span> Hits on
  	<span class="sdl-pages">0</span> Page(s)
    </span>
    <span class="sdl-links">
      <span class="sdl-first">First</span>
      <span class="sdl-previous">Previous</span>
      <span class="sdl-number-links">&nbsp;</span>
      <span class="sdl-next">Next</span>
      <span class="sdl-last">Last</span>
    </span>
  </div> <!-- /sdl -->


