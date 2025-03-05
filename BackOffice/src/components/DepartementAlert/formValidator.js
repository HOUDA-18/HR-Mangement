function formValidation(values){
    let errorsSpec = {};
    let erreur= false;

  
    if(values.code === ""){
        errorsSpec.code="Required field"
        erreur= true;
       }
    if(values.name === ""){
        errorsSpec.name="Required field"
        erreur= true;
       }
    

    return [errorsSpec, erreur];
  
  }
  
  export default formValidation;