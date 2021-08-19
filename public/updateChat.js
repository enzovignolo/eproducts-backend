function updateChat(messages) {
	let msgTemplate = ` <% if(messages){%>
  <% messages.forEach(function(message){ %>
        <div class="card text-white bg-primary mb-3" style="max-width: 90%; margin:2%;" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="card-header">
          <strong class="md-auto"><%=message.user%></strong> 

        </div>
        <div class="card-body">
        <p class="card-text"><%=message.message%></p>
        </div>
        </div>
        <div style="padding-left:70%;"><small><%=message.date%></small></div>

        

        <%});%>
        <%}else{%>
          <div class="alert alert-dismissible alert-warning">
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
          <h4 class="alert-heading">Hello!</h4>
          <p class="mb-0"> There is no messages in the chat yet.You can choose an email an start chatting.</p>

        </div>
        <%};%> `;
	const html = ejs.render(msgTemplate, { messages: messages });
	return html;
}
