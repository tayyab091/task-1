$(document).ready(function () {
  const apiUrl = "https://usmanlive.com/wp-json/api/stories";
  const postList = $("#postList");


  function loadPosts() {
    $.get(apiUrl, function (posts) {
      postList.empty();
      posts.forEach(post => {
        postList.append(`
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title">${post.title}</h5>
              <p class="card-text">${post.content}</p>
              <div class="d-flex justify-content-end gap-2">
                <button class="btn btn-sm btn-warning edit-btn" data-id="${post.id}">Edit</button>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${post.id}">Delete</button>
              </div>
            </div>
          </div>
        `);
      });
    });
  }

  loadPosts();

  
  $("#addForm").submit(function (e) {
    e.preventDefault();
    const title = $("#title").val();
    const content = $("#content").val();

    $.post(apiUrl, { title, content }, function () {
      $("#title").val("");
      $("#content").val("");
      loadPosts();
    });
  });

  
  postList.on("click", ".delete-btn", function () {
    const id = $(this).data("id");
    $.ajax({
      url: `${apiUrl}/${id}`,
      type: "DELETE",
      success: loadPosts
    });
  });


  postList.on("click", ".edit-btn", function () {
    const id = $(this).data("id");
    const card = $(this).closest(".card");
    const title = prompt("Edit title:", card.find(".card-title").text());
    const content = prompt("Edit content:", card.find(".card-text").text());
    if (title != null && content != null) {
      $.ajax({
        url: `${apiUrl}/${id}`,
        type: "PUT",
        data: { title, content },
        success: loadPosts
      });
    }
  });
});
