function updateTable(data) {
	let template = `<%if (message){%>	
		<div class="alert alert-dismissible alert-warning">
		  <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
		  <p class="mb-0"><%= message %>.</p>
		</div>
	  
	  <%}%>
	  <% if(products){ %>
		  <table class="table table-hover justify-content-center table-striped table-md">
			<thead>
			  <tr class=" table-primary">
				
				<th class="text-center align-middle " scope="col">Image</th>
				<th class="text-center align-middle " scope="col">Name</th>
				<th class="text-center align-middle " scope="col">Price</th>
			  </tr>
			</thead>
			<tbody >
			  <% products.forEach(function(product){ %>
			  <tr class="table-light ">
				<td class="text-center align-middle "><img src="<%=product.thumbnail%>" alt="<%=product.name%> image" width="50" height="50"></td>
				<td class="text-center align-middle " scope="row"><%=product.name%></th>
				<td class="text-center align-middle ">$<%=product.price%></td>
			 
			  </tr>
		  <%});%>
			  
		  <% } %>`;
	const { products, message } = data;

	const html = ejs.render(template, { products, message });

	return html;
}
