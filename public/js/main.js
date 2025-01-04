$(document).ready(function () {
  // Handle form submission
  $("#addTaskForm").on("submit", function (e) {
    e.preventDefault(); // Prevent the default form submission

    // Gather form data using FormData (for multipart form data)
    const formData = new FormData(this);

    // Validate form data (client-side)
    const name = $("#name").val().trim();
    const description = $("#description").val().trim();
    const status = $("#status").val();
    if (!name || !description || !status) {
      alert("Please fill out all fields.");
      return;
    }

    // Post data to server via AJAX
    $.ajax({
      url: "/addTask",
      type: "POST",
      data: formData,
      processData: false, // Don't process the data
      contentType: false, // Don't set content type
      success: function () {
        // Redirect on successful submission
        window.location.href = "/";
      },
      error: function (xhr, status, error) {
        // Handle errors
        console.error("Error:", status, error);
        alert("Failed to add task. Please try again.");
      }
    });
  });

  // Handle delete task action using DELETE method
  $(".delete-btn").on("click", function () {
    const taskId = $(this).data("id");

    // Confirm deletion
    if (confirm("Are you sure you want to delete this task?")) {
      $.ajax({
        url: "/deleteTask/" + taskId,
        type: "DELETE", // Use DELETE method
        success: function () {
          // Remove the deleted task from the table
          $("button[data-id='" + taskId + "']").closest("tr").remove();
        },
        error: function (xhr, status, error) {
          // Handle errors
          console.error("Error:", status, error);
          alert("Failed to delete task. Please try again.");
        }
      });
    }
  });
});
