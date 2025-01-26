// date picker from tomorrow code

var currentDateTime = new Date();
var year = currentDateTime.getFullYear();
var month = (currentDateTime.getMonth() + 1);
var date = (currentDateTime.getDate() + 1);

if(date < 10) {
  date = '0' + date;
}
if(month < 10) {
  month = '0' + month;
}

var dateTomorrow = year + "-" + month + "-" + date;
var dateSelect = document.querySelector("#formDate");

dateSelect.setAttribute("min", dateTomorrow);

// maintain min value in number of people

function ensureMinimumValue(input) {
    // Get the entered value
    var enteredValue = input.value;

    // Check if the entered value is less than 1
    if (enteredValue < 1) {
      // If it's less than 1, set the input value to 1
      input.value = 1;
    }
  }


// main code

// var clientName = "Empty"
// var emailId = "Empty"
// var mobileNo = "Empty"
// var country = "Empty"
// var courseType = "Empty"
// var noOfPeople = "1";
// var finalprice = "6"; // in dollars

// $(document).on('input', '#formPeople', function(){
//     noOfPeople = $("#formPeople").val();
//     finalprice = 6*Number(noOfPeople);
//     finalprice = finalprice.toString();
// });

var cname, cemail, cmobile, ccountry, cdate, cschedule, cnumberOfPeople;

paypal.Buttons({
    createOrder: function(data, actions) {

        cname = $("#formName").val();
        cemail = $("#formEmail").val();
        cmobile = $("#formMobile").val();
        ccountry = $("#formCountry").val();
        cdate = $("#formDate").val();
        cschedule = $("#formSchedule option:selected").text();
        cnumberOfPeople = $("#formPeople").val();

        if (!cname || !cemail || !cmobile || !ccountry || !cdate || !cschedule || !cnumberOfPeople) {
            alert("Please fill out all the form fields.");
            return false; // Prevent order creation
        }

        perHeadPrice = (cschedule === "3:30 PM - 5 PM (Yoga Intermediate/Advance Private Class)" || cschedule === "7 AM-8 AM (Yoga Beginner/Intermediate Private Class)" || cschedule === "6 AM - 7 AM (Pranayam Private Class)") ? 15 : 6;

        finalprice = perHeadPrice*Number(cnumberOfPeople);
        finalprice = finalprice.toString();
        localStorage.setItem('amountPaid', finalprice);

        // This function sets up the details of the transaction, including the amount and line item details.
        return actions.order.create({
        purchase_units: [{
            amount: {
            value: finalprice,
            }
        }]
        });
    },
    onApprove: function(data, actions) {

        var templateParams = {
            from_name: cname,
            to_name: "Yoga Siddharth",
            reply_to: cemail,
            email: cemail,
            mobileNo: cmobile,
            country: ccountry,
            noOfPeople: cnumberOfPeople,
            date: cdate,
            schedule: cschedule,
        };

        // This function captures the funds from the transaction.
        return actions.order.capture().then(function(details) {
        // This function shows a transaction success message to your buyer.
        emailjs.send('service_1j5dsn9', 'template_44ta8ws', templateParams)
            .then(function(response) {
               console.log('SUCCESS!', response.status, response.text);
               window.location.href = "payment_conf.html";
            }, function(error) {
               console.log('FAILED...', error);
            });
        // alert('Transaction completed ' + details.payer.name.given_name);
        });
    }
    }).render('#paypal-button-container');
    //This function displays Smart Payment Buttons on your web page.

    // Testing mail service

    
    // $("#booknow").click(function(){
    //     emailjs.send('service_1j5dsn9', 'template_44ta8ws', templateParams)
    //     .then(function(response) {
    //        console.log('SUCCESS!', response.status, response.text);
    //     }, function(error) {
    //        console.log('FAILED...', error);
    //     });
    // });
