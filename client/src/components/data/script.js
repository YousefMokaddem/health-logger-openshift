import $ from 'jquery';

const script = () => {
    $(document).ready( () => {
        if($('page-buttons').length !== 0){

            let $cards = $('.food-grid').children();
            let list = $cards;
            let buttonDiv;
            if($('.page-buttons').length === 0){
                buttonDiv = document.createElement('div');
                buttonDiv.className = "page-buttons"
            }else{
                buttonDiv = $('.page-buttons')[0];
            }

            console.log(list)

            const elementsPerPage = 8;
            /*** 
             sets display properties based on the pageNum.
            ***/
            function showPage(pageNum, list){
                //clear all 
                for (let i = 0; i < $cards.length; i++){
                    $cards[i].style.display = 'none';
                }
                // display the elements on the page
                for (let i = 0; i < list.length; i++){
                    if(i + 1 > (pageNum * elementsPerPage) - elementsPerPage && i < pageNum * elementsPerPage){
                        list[i].style.display = '';
                    }
                }
            }


            /*creates page links based on the int numElements passed into the func*/
            function appendPageLinks(numElements){
                //remove old page links
                while(buttonDiv.firstElementChild){
                    buttonDiv.removeChild(buttonDiv.firstElementChild);
                }
                //add new page links
                const buttonList = document.createElement('ul');
                for (let i = 0; i < Math.ceil(numElements/elementsPerPage); i++){
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    if (i === 0){a.className = 'active';}
                    a.textContent = i + 1;
                    li.appendChild(a);
                    buttonList.appendChild(li);
                }
                buttonDiv.appendChild(buttonList);
                document.querySelector('.food-grid').parentNode.appendChild(buttonDiv);
            
                buttonDiv.addEventListener('click', (e) =>{
                if(e.target.tagName === 'A'){
                    //change active class to clicked link
                    for (let i = 0; i < buttonList.children.length; i++){
                        buttonList.children[i].firstElementChild.className = '';
                    }
                    e.target.className = 'active';
                    showPage(e.target.textContent, list);
                }
                });
                
            }
            appendPageLinks(list.length);
            showPage(1,$cards);

        }else{
            let $cards = $('.food-grid').children();
            console.log($cards);
        }
    });
    
}

export default script;
