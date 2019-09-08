import React from 'react';


class ShowRemark extends React.Component {
   // props: elementtId (id of challenge, question, snippet, comment)
   //        elementType ("challenge", "question", "snippet", "comment")
   constructor() {
      super();

      this.state = {
      	content: '',
         label: '',
      }

   }
   
   // pre-processing for this component
   componentDidMount = async () => {

      // provide a label to the "add (remark)" title 
      // where the form is displayed with the relevant component
      let label;
       
      switch (this.props.elementType) {

         // Set a label to title the remark box

         case 'challenge':
            label = "Ask a Question";
            break;

         case 'snippet':
            label = "Leave a Comment";
            break;

         case 'question':
            label = "Give a Response";
            break;

         case 'comment':
             label = "Make an Observation";
            break;

         default:
            console.log("Remarks are only for a challenge, snippet, question, or comment")
      }

      this.setState({
         label: label,
      })

      
   }

      
   render() {

      return (

         <div>

            <h3>This is "ShowRemark"</h3>

            
         </div>
           
      );

   }

}

export default ShowRemark;
