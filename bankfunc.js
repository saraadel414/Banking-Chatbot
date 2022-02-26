var ibmdb = require('ibm_db');
 var nodemailer = require('nodemailer');
  process.env.TZ = "Africa/Cairo";
function getAccountList(dsn, inputs3) {
    try {
        var conn = ibmdb.openSync(dsn);
        var resString = "";
        var data2 = conn.querySync("select CUSTOMERNAME, PASSWORD from CUSTOMER where CUSTOMERID=?", [inputs3[0]]);
        var custompwd;
        if(data2.length == 0){
            resString+= "incorrect_customid";
            conn.closeSync();
            return {result:resString, input:inputs3[0]};
        }
        else{
            custompwd = data2[0]['PASSWORD'];
            if(custompwd == inputs3[1]){
        var data = conn.querySync("select BACCOUNTID from BANKACCOUNT where CUSTOMERID=?", [inputs3[0]]);
        
        
        if (data.length == 0) {
            resString ="zero_accounts";
            conn.closeSync();
            return {result:resString};
        } else {
            resString += "Hello "+ data2[0]['CUSTOMERNAME']+" \n";    
            resString += "Here is a list of your accounts: \n";
            for (var i = 0; i < data.length; i++) {
                resString += "Bank Account ID: " + data[i]['BACCOUNTID'] + "\n";
            }
            conn.closeSync();
            return { result: resString, data: data, input: inputs3 };
         
        }
                
            }
        else{
            resString+= "incorrect_custompass";
            conn.closeSync();
            return {result:resString, data:data2};
        }
        // Return both generated string and data
      
    }
        
    } catch (e) {
        return { dberror: inputs3 }
    }
}
function BAccountLogin(dsn, config) {
    try {
        //config[0] is bank account id
        //config[1] is password
        var conn = ibmdb.openSync(dsn);
        var data = conn.querySync("select PASSWORD , BA_BALANCE from BANKACCOUNT where BACCOUNTID=?", [config[0]]);
        conn.closeSync();
        var pwd = data[0]['PASSWORD'];
        var resString = "";
        if (data.length == 0) {
            resString += "incorrect_id";
        }
        else if (pwd != config[1]) {
            resString += "incorrect_pass";
        }
        else {
            resString += "true";
            
        }

        return { result: resString, data: data, input:config};
    } catch (e) {
        return { dberror: e }
    }
}
function cancelTransByTid(dsn, inputs) {
    try {
        //inputs[0] is FROM bank account id
        //inputs[1] is transaction id
        var conn = ibmdb.openSync(dsn);
        var data = conn.querySync("select BANKTRANSACTIONID,BTCREATIONDATE,BTAMOUNT,BTFROMACC,BTTOACC , TIMEZONE from BANKTRANSACTION where BTFROMACC=? ", [inputs[0]]);
        //conn.closeSync();
        var resString = "";
        var fromBa = 0;
        var toBa = 0;
        //if data is not empty check for transaction id
        if (data.length != 0) {
            var coun=0;
            for(var j=0;j<data.length; j++){
                var tranid=data[j]['BANKTRANSACTIONID']
                if(tranid==inputs[1]){
                    coun++;
                }
            }
            if (coun==0){
             resString += "wrong id"; 
            }
          else {  
        for (var i=0;i<data.length;i++) {
        var transactionID = data[i]['BANKTRANSACTIONID'];
        var toAccount = data[i]['BTTOACC'];
        var Amount = data[i]['BTAMOUNT'];
            if (transactionID == inputs[1]) {
            var compareDatesBoolean=false; 
          var tdate=new Date(data[i]['BTCREATIONDATE']);
            var date=new Date();
           var nowHours=date.getTime()/3600000;//from milisecond to hours
           var transHours=tdate.getTime()/3600000;//from milisecond to hours
           var hours= nowHours-transHours;
                if(hours<=24)
                {
               compareDatesBoolean =true;
                }
                
                if (compareDatesBoolean==true) {
                    
                    var amount = conn.querySync("select BA_BALANCE from BANKACCOUNT where BACCOUNTID=? ", [inputs[0]]);
                     fromBa = amount[0]['BA_BALANCE'] + data[i]['BTAMOUNT'];
                    var toAmount =conn.querySync("select BA_BALANCE from BANKACCOUNT where BACCOUNTID=? ", [data[i]['BTTOACC']]);
                     toBa = toAmount[0]['BA_BALANCE'] - data[i]['BTAMOUNT'];
                    
                    
                    conn.querySync("Update BANKACCOUNT SET BA_BALANCE=? where BACCOUNTID=? ", [fromBa, inputs[0]]);
                    conn.querySync("Update BANKACCOUNT SET BA_BALANCE=? where BACCOUNTID=? ", [toBa, data[i]['BTTOACC']]);
                    conn.querySync("Delete from BANKTRANSACTION where BANKTRANSACTIONID=? ", [inputs[1]]);
                    resString += "success";
                }
                else {
                    resString += "not recent";
                }
            }
            
        }
              
          }
            
        }
        else {
            resString += "zero transactions";
        }
        conn.closeSync();
        return { result: resString,data:inputs[1], from:fromBa, To:toBa };

    } catch (e) {
        return { dberror: inputs }
    }
}
function getTransToCancelList(dsn, bankid) {
    try {
    
      var conn = ibmdb.openSync(dsn);
     var data = conn.querySync("SELECT BANKTRANSACTIONID,BTCREATIONDATE,BTAMOUNT,BTFROMACC,BTTOACC from BANKTRANSACTION where BTFROMACC=? ",[bankid] );
  var resString = ""; 
  var arr = new Array();
  for (var i=0;i<data.length;i++) 
  {     
         var tdate=new Date(data[i]['BTCREATIONDATE']);
            var date=new Date();
           var nowHours=date.getTime()/3600000;//from milisecond to hours
           var transHours=tdate.getTime()/3600000;//from milisecond to hours
           var hours= nowHours-transHours;
       if (hours<=24)
       {
           resString+="Transaction id: "+data[i]['BANKTRANSACTIONID']+"  Amount: "+data[i]['BTAMOUNT']+" To: "+data[i]['BTTOACC']+"  in: "+data[i]['BTCREATIONDATE']+"\n";
         arr.push(data[i]['BANKTRANSACTIONID']);
       }
  }
  if (arr.length==0)
  {
      resString+="There are no transactions can be cancelled";
   }
 

//conn.closeSync();
      return { result:resString, data: data, input:bankid };
  } catch (e) {
      return { dberror: e }
  }
  
}

function getTransByToID(dsn, inputs){
    try{
        //inputs[0] is FROM bank account id
        //inputs[1] is TO bank account id
          var conn = ibmdb.openSync(dsn);
        var data = conn.querySync("select BANKTRANSACTIONID,BTCREATIONDATE,BTAMOUNT,BTFROMACC,BTTOACC from BANKTRANSACTION where BTFROMACC=? AND BTTOACC=?", [inputs[0],inputs[1]]);
        //conn.closeSync();
        var resString = "";
        if(data.length==0){
            resString+="There are no transactions made to this bank account";
        }
        else{
            for (var i=0;i<data.length;i++) {
                 resString+="Transaction: "+data[i]['BANKTRANSACTIONID']+"  Amount: "+data[i]['BTAMOUNT']+"  in: "+data[i]['BTCREATIONDATE']+"\n";
            } 
        }
       conn.closeSync(); 
       return { result: resString, data: data, input: inputs };  
    }
    catch (e) {
        return { dberror: inputs }
    }

}

function getTransInDate(dsn, inputs){
    try{
        //inputs[0] is FROM bank account id
        //inputs[1] is start date
        //inputs[2] is end date
          var conn = ibmdb.openSync(dsn);
        var data = conn.querySync("select BANKTRANSACTIONID,BTCREATIONDATE,BTAMOUNT,BTFROMACC,BTTOACC from BANKTRANSACTION where BTFROMACC=?", [inputs[0]]);
        //conn.closeSync();
        var resString = "";
        if(data.length==0){
            resString+="There are no transactions made in this bank account";
        }
        else{
             var arr = new Array();
            for (var i=0;i<data.length;i++) 
            {
                var trDate =new Date(data[i]['BTCREATIONDATE']);
                var stDate=new Date(inputs[1]);
                var enDate=new Date(inputs[2]);
                trDate.setHours(0,0,0,0);
                stDate.setHours(0,0,0,0);
                enDate.setHours(0,0,0,0);
                var tranTime=trDate.getTime()/3600000;
                var startTime=stDate.getTime()/3600000;
                var endTime=enDate.getTime()/3600000;
                if(tranTime>=startTime && tranTime<= endTime){
                    arr.push(data[i]['BANKTRANSACTIONID']);
                }
            }
            if(arr.length==0){
                resString+="There are no transactions made in this time range";
                
            }
            else{
                  resString+="Transactions are: \n";
                for (var j=0; j<arr.length; j++){
                     resString+="Transaction "+arr[j]+"\n";
                }
            }
        }
        conn.closeSync();
       return { result: resString, data: data, input: inputs };  
    }
    catch (e) {
        return { dberror: inputs }
    }

}
function passwordReset(dsn, bankid) {
    try {
        
         //var nodemailer = require('nodemailer');
 /*let smtpConfig={
     host:'smtp.mail.gmail.com',
     port:465,
     secure:true,
     auth: {
    user: 'emaan.ahmed1189@gmail.com',
    pass: 'Eman1111'
  }
 };*/
        var conn = ibmdb.openSync(dsn);
        var data = conn.querySync("select EMAIL from BANKACCOUNT where BACCOUNTID=?", [bankid]);
        var resString = "";
        if(data.length==0){
           resString+="You must have email to reset password"  
        }
        else{

           var randompass="";
         for(var i=0; i<8; i++){
            var random = (Math.floor(Math.random() * (9 - 0) + 0)).toString();
           randompass+=random;
                   }
 var sent=false;
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'emaan.ahmed1189@gmail.com',
    pass: 'Eman1111'
  }
});

var mailOptions = {
  from: 'emaan.ahmed1189@gmail.com',
  to: data[0]['EMAIL'],
  subject: 'Password reset',
  text: 'Your new password is: '+randompass
};

transporter.sendMail(mailOptions, (err, info) =>{
  if (err) {
    resString+="error reseting email";
  } else {
   resString+="Your password were reset successfully";
   sent=true;
  }
});
     if (sent==true){
         conn.querySync("update BANKACCOUNT set PASSWORD=? where BACCOUNTID=?", [randompass,bankid]);
         
     }

        }
        return { result:resString , data: data, input: bankid };
    } catch (e) {
        return { dberror: e }
    }
}
function checkBalance(dsn, bankid) {
    try {
        var conn = ibmdb.openSync(dsn);

        var data = conn.querySync("select BA_BALANCE, CUSTOMERID from BANKACCOUNT where BACCOUNTID=?", [bankid]);
        
        var resString = "Your current balance is ";
            resString += data[0]['BA_BALANCE'] + "\n";
        
conn.closeSync();
        return { result: resString, data: data, input: bankid };
    } catch (e) {
        return { dberror: e }
    }
}
function transfermoney(dsn, inputs) {
    try {
        //inputs[0] is bank account id
        //inputs[1] is TO bank account id
        //inputs[2] is amount
        var fromAcc = inputs[0];
        var TOAcc = inputs[1];
        var money = inputs[2];
        var conn = ibmdb.openSync(dsn);
        var data = conn.querySync("select BA_BALANCE from BANKACCOUNT where BACCOUNTID=?",[fromAcc]);
        var resString = "";
        var Frombalance = data[0]['BA_BALANCE'];
         
        if(fromAcc==TOAcc){resString+= "same account";
             return { result: resString };
        }
        else{
        if (Frombalance >= money) {
            //then bank account id check
           
             var data2 = conn.querySync("select BA_BALANCE from BANKACCOUNT where BACCOUNTID=?", [TOAcc]);
          
            if (data2.length == 0) { resString += "wrong id"; 
                 return { result: resString };
            }
            else {
            
            var FromnewAmount = Frombalance - money;
            conn.querySync("update BANKACCOUNT set BA_BALANCE=? where BAccountID=?", [FromnewAmount,fromAcc]);
            
            var TObalance = data2[0]['BA_BALANCE'];
            var TOnewAmount = (TObalance-0) + (money-0);
            
                conn.querySync("update BANKACCOUNT set BA_BALANCE=? where BAccountID=?", [TOnewAmount,TOAcc]);
           
              let date_ob = new Date();
              let date = ("0" + date_ob.getDate()).slice(-2);
              let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
              let year = date_ob.getFullYear();
              let hours = date_ob.getHours();
              let minutes = date_ob.getMinutes();
              let seconds = date_ob.getSeconds();
              let day =year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
              
               
             let sql = 'INSERT INTO BANKTRANSACTION  (BTCREATIONDATE, BTAMOUNT, BTFROMACC, BTTOACC) VALUES (?, ?, ?, ?);' ;
             let values = [day, money, fromAcc,TOAcc];
             conn.querySync(sql,[day, money, fromAcc,TOAcc]);
             var data5 = conn.querySync("select BANKTRANSACTIONID from BANKTRANSACTION ORDER BY BANKTRANSACTIONID DESC FETCH FIRST 1 ROW ONLY;");
             var traID = data5[0]['BANKTRANSACTIONID'];
                   resString += "success"; 
                  
                   conn.closeSync();
            }
             return { result: resString, output:traID };
        }
        else {
            var boolean  = "false";
            resString += "You don't have this amount of money \n";
            resString += "Your Account Balance is " + Frombalance + "\n";
             return { result: resString, data:boolean };
        }
        
        }
        
       
conn.closeSync();
        
    }

      
       
     catch (e) {
        return { dberror: inputs }
    }
}
function FrequentQuestion(dsn, FQUESTION){
   try{ 
   
      var restring ="";
     
            var conn = ibmdb.openSync(dsn);
            var data = conn.querySync("select COUNTER from FAQ where QUESTION = ?;",[FQUESTION]);
           
            if(data.length != 0){
                 var count = data[0]['COUNTER'];
                count =count + 1;
                conn.querySync("update FAQ set COUNTER=? where QUESTION=?;", [count,FQUESTION]);
             
            }
            else{
                var counter = 1;
            let sql = "INSERT  INTO  FAQ (QUESTION, COUNTER)  VALUES (? ,?);" ;
            conn.querySync(sql ,[FQUESTION,counter]);
               
            }
            
            restring += "Done";
            conn.close();
            conn.closeSync();
   return {result : restring ,data:FQUESTION };
}
    catch (e) {
        return { dberror: data }
    }
}

function changepassword(dsn, inputs) {
    try {
        //inputs[0] is bank id
        //inputs[1]is new pass
        
        var conn = ibmdb.openSync(dsn);

        var data = conn.querySync("select PASSWORD from BANKACCOUNT where BACCOUNTID=? and PASSWORD=?", [inputs[0],inputs[1]]);
        //conn.closeSync();
        var resString = "";
        var oldpassword = inputs[1];
        var newpassword=inputs[2];
        var newpassword2 = inputs[3];
        var id=inputs[0];
        if (oldpassword == newpassword){
            resString += "duplicate";
        }
        if(newpassword != newpassword2){
            resString += "false2";
        }
        if (data.length != 0) {
         if(newpassword.length > 6){
           conn.querySync("Update BANKACCOUNT SET PASSWORD=? where BACCOUNTID=? ", [newpassword, id]);
           resString += "true";}
         else{
         resString += "false";
        
}
        }else
        {
            resString+="wrong_old_password";
        }
        conn.closeSync();
        return { result: resString, data: data, input:inputs};
} catch (e) {
        return { dberror: e }
    }}
    

function updateAddress(dsn, inputs) {
    try {
       //inputs[0] is cid
       //inputs[1]is  the new Address     
        
        var conn = ibmdb.openSync(dsn);
        var data = conn.querySync("select CUSTOMERADDRESS from CUSTOMER where CUSTOMERID=?", [inputs[0]]);
        
        var resString = "";
		var new_address=inputs[1];
		
        if (data.length != 0) {
          var CAddress = data[0]['CUSTOMERADDRESS'] ;
          
               if(CAddress != new_address)
              { 
                conn.querySync("Update CUSTOMER SET CUSTOMERADDRESS=? where CUSTOMERID=? ", [new_address, inputs[0]]);
                  resString += "success";
               }
			   
			  else{   resString += "fail";  }   //as customer enters the new address same as the old one 

			
			}
      else 	{resString += "There is no customer with this id.. sorry"}	
	  conn.closeSync();
    return{result: resString, input:new_address};    
    }
	catch (e) {
        return { dberror: inputs }
    }}
    
    function updatePhone(dsn, inputs) {
    try {
       //inputs[0] is cid
       //inputs[1]is  the new number     
        
        var conn = ibmdb.openSync(dsn);
        var data = conn.querySync("select CUSTOMERMOBILE from CUSTOMER where CUSTOMERID=?", [inputs[0]]);
        
        var resString = "";
        
		var new_number=inputs[1];
        if (data.length != 0) {
           var CAMobile = data[0]['CUSTOMERMOBILE'] ;
               if(CAMobile != new_number)
              { 
                  conn.querySync("Update CUSTOMER SET CUSTOMERMOBILE=? where CUSTOMERID=? ", [new_number, inputs[0]]);
                  resString += "success";
               }
			   
			  else{   resString += "fail";  }   //as customers enters the new phone same as the old one  

			  conn.closeSync(); 
			}
      else 	{resString += "There is no customer with this id.. sorry"}	
	 conn.closeSync();
    return{result: resString, input:new_number};    
    }
	catch (e) {
        return { dberror: resString }
    }
    }
    
        
  function feedback(dsn, rate) { 
            try{
            var resString ="";
            var conn = ibmdb.openSync(dsn);
            

            var data = conn.querySync("SELECT COUNTER FROM FEEDBACK  where RATE =?;", [rate]);
            var count = data[0]['COUNTER'];
            count = count+1;
            conn.querySync("Update FEEDBACK SET COUNTER=? where RATE=? ", [count, rate]);
            resString += "success";
            
            
            conn.closeSync();
           return{result: resString, input:rate ,data:data}     
           }
           catch (e) {
        return { dberror: data }
    } }

    
    
    
    
function main(params) {
    console.log("pok");
    
    dsn = "DATABASE=BLUDB;HOSTNAME=dashdb-txn-sbox-yp-lon02-04.services.eu-gb.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=zvb05495;PWD=2pj0l4vl-mch2z0v;";
    
    
    /*let now = "Fri Jul 09 2021 10:30:21";

    // This is returned as: July 18, 2018 at 3:48:00 AM UTC+1
    const hour = 1000 * 60 * 60 * 24;
    const hourago = new Date().getTime() + hour;
    var compareDatesBoolean = now < hourago;
    console.log(compareDatesBoolean, now, hourago);*/
    // dsn does not exist in the DB2 credential for Standard instance. It must be built manually
    if (!dsn) {
        const dbname = 'BLUDB';
        const hostname = 'dashdb-txn-sbox-yp-lon02-04.services.eu-gb.bluemix.net';
        const port = 50000;
        const protocol = 'TCPIP';
        const uid = 'zvb05495';
        const password = '2pj0l4vl-mch2z0v';

        //dsn="DATABASE=;HOSTNAME=;PORT=;PROTOCOL=;UID=;PWD=;Security=SSL";
        dsn = `DATABASE=${dbname};HOSTNAME=${hostname};PORT=${port};PROTOCOL=${protocol};UID=${uid};PWD=${password};Security=SSL`;
    }
    

    switch (params.actionname) {

        case "checkBalance":
            return checkBalance(dsn, params.bankid);
        case "getAccountList":
            return getAccountList(dsn, params.inputs3.split(","));
        case "BAccountLogin":
            return BAccountLogin(dsn, params.config.split(","));
        case "transfermoney":
            return transfermoney(dsn, params.inputs.split(","));
        case "cancelTransByTid":
            return cancelTransByTid(dsn, params.inputs.split(","));
        case "getTransToCancelList":
            return getTransToCancelList(dsn, params.bankid);
        case "getTransByToID":
            return getTransByToID(dsn, params.inputs.split(",")); 
        case "getTransInDate":
            return  getTransInDate(dsn, params.inputs.split(",")); 
            case "passwordReset":
                return passwordReset(dsn, params.bankid);
        case "changepassword":
            return changepassword(dsn, params.inputs.split(","));
        case "updatePhone":
            return updatePhone(dsn,params.inputs.split(","));
        case "updateAddress":
            return updateAddress(dsn,params.inputs.split(","));
       case "FrequentQuestion":
            return FrequentQuestion(dsn,params.FQUESTION);
      case "feedback":
            return feedback(dsn,params.rate);
        default:
            return { dberror: "No action defined", actionname: params.actionname }
    }
}

