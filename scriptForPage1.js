console.log("js file is running");
const xhr=new XMLHttpRequest();
xhr.open('GET','http://localhost:5000/menu-items',true);
xhr.onreadystatechange=function(){
    if(this.readyState===XMLHttpRequest.DONE && this.status===200){
        const menuItems = JSON.parse(this.responseText);
        const menuList=document.getElementById('menu');
        menuItems.forEach(item => {
            const listItem=document.createElement('li');
            listItem.innerHTML="ID::"+item.ItemId+"<br>"+"Name::"+item.ItemName +"<br>"+"ParentID::"+item.ParentId +"<br>" +"Level::"+item.Level+"<br>";
            menuList.appendChild(listItem);
        });
    }
}
xhr.send();