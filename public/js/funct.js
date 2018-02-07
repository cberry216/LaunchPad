
module.exports = {

     lastMonth:function(month){
        if(month == 1){
            return 12;
        }
        return month - 1;
    },
    
     convertDate:function(date) {
      var yyyy = date.getFullYear().toString();
      var mm = (date.getMonth()+1).toString();
      var dd  = date.getDate().toString();
    
      var mmChars = mm.split('');
      var ddChars = dd.split('');
    
      return yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);
    },
    
    hello:function(){
        console.log("hello");
    }
}