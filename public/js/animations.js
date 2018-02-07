var blastoff = null;
var now = null;
        
var update = function() {
  /* global moment */
  var duration = moment.duration(blastoff.diff(moment()));
  /* If the launch time happens before the current time then don't display it */
  if(blastoff.isAfter(moment())) {
    $("#countdown-timer").html("T - " + ((duration.days() >= 10) ? (duration.days() + " d : ") : ("0" + duration.days() + " d : ")) +
                                        ((duration.hours() >= 10) ? (duration.hours() + " h : ") : ("0" + duration.hours() + " h : ")) +
                                        ((duration.minutes() >= 10) ? (duration.minutes() + " m : ") : ("0" + duration.minutes() + " m : ")) +
                                        ((duration.seconds() >= 10) ? (duration.seconds() + " s"): ("0" + duration.seconds() + " s")));
    $(".card-header").first().removeClass("in-process-launch");
    $(".modal-header").first().removeClass("in-process-launch");
    $(".launch-status").first().removeClass("in-process-launch");
  } else {
    $("#countdown-timer").html("T + " + ((duration.days() >= 10) ? ((duration.days() * -1) + " d : ") : ("0" + (duration.days() * -1) + " d : ")) +
                                        ((duration.hours() >= 10) ? ((duration.hours() * -1) + " h : ") : ("0" + (duration.hours() * -1) + " h : ")) +
                                        ((duration.minutes() >= 10) ? ((duration.minutes() * -1) + " m : ") : ("0" + (duration.minutes() * -1) + " m : ")) +
                                        ((duration.seconds() >= 10) ? ((duration.seconds() * -1) + " s"): ("0" + (duration.seconds() * -1) + " s")));
    $("#index-container").find(".card-header").first().addClass("in-process-launch");
    $("#index-container").find(".modal-header").first().addClass("in-process-launch");
    $("#index-container").find(".launch-status").first().addClass("in-process-launch");
    $("#index-container").find(".launch-status").first().html("In Progress");
  }
};

function main() {
  /*global $*/
  /* Hiding Everything */
  $('.background-image').hide();
  $('.content').hide();
  $('.upcoming-launches').hide();
  
  /* Fadding In */
  $('.background-image').fadeIn(1000);
  $('.content').fadeIn(1500);
  $('.upcoming-launches').fadeIn(1000);
  
  /* Dynamically Changing Clock */
  blastoff = moment($('#next-launch-iso-date').html());
  update();
  setInterval(update, 1000);
}

$(document).ready(main);