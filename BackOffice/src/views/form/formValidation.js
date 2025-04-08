
function formValidation(values){
    let errorsSpec = {};
    let erreur= false;

    let errors = {
        firstname: false,
        lastname: false,
        matricule: false,
        email: false,
        password: false,
        password_confirmation: false,
        phone: false,
        employementType: false
    };
    let emailPattern = /^[^@]+@[^@]+\.[^@]+$/;
  
    if(values.firstname === ""){
        errors.firstname= true
        errorsSpec.firstname="Required field"
        erreur= true;
       }
    if(values.lastname === ""){
        errors.lastname= true
        errorsSpec.lastname="Required field"
        erreur= true;
       }
    if(values.matricule === ""){
        errors.matricule= true
        errorsSpec.matricule="Required field"
        erreur= true;
       }
    if(values.phone === ""){
        errors.phone= true
        errorsSpec.phone="Required field"
        erreur= true;
       }

    if( values.employementType===""){
        errors.employementType= true
        errorsSpec.employementType="Required field"
        erreur= true;
    }
    
    if(values.email === ""){
      errors.email= true
      errorsSpec.email="Required field"
      erreur= true;
     }
     else if(!emailPattern.test(values.email)){
      errors.email= true
      errorsSpec.email="Enter a valid email"
      erreur= true;
    } 

    if(values.password_confirmation === ""){
        errors.password_confirmation= true
        errorsSpec.password_confirmation="Required field"
        erreur= true;
      }
  
    if(values.password === ""){
      errors.password= true
      errorsSpec.password="Required field"
      erreur= true;
    }else if(values.password != values.password_confirmation){
        errors.password_confirmation = true
        errors.password = true
        errorsSpec.password_confirmation="Password doesn't match"
        erreur= true;
    }
/*      let cles = Object.keys(values);
    for (let index = 0; index < cles.length; index++) {
        Object.assign(errors,{
            [cles[index]]: false,
        })        
    }

    console.log(JSON.stringify(errors))

    for (let element of cles) {
        if(values[element] === ""){
            errors[element]=true;
            errorsSpec[element]="Required field"
            erreur= true;
        }
    }    */
    

    return [errors, errorsSpec, erreur];
  
  }
  
  export default formValidation;