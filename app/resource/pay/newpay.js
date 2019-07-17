//api_type 1:搜索框模版第一个api 2:普通模版 3:搜索框模版第二个api 4:列表模版

function search(pay,preview){//api_type==2 普通模版查询
  var uuid = $("#uuid").val();
  if (uuid == '') {
      $('#login').modal('show');
  }else{
    if(shelves_check(preview) && limited_check(preview)){
      var form=parseform();
      if(!form){
        return false
      }

      if(pay==1){//支付
        // console.log('此处调支付流程')
          var product_id = $('#product_id').val(), type = 'message', orderNo = '', uuid = $('#uuid').val(), grade = $('#membership_grade').val(),
              price = $('#price').val(), member_price = $('#member_price').val(),balance = $('#balance').val(),query_type = 'search_common', index = '', url='',
              facilitator_uuid = $('#facilitator_uuid').val(), product_name = '', deliver_type = '', preview = '';
          payOrder(product_id, type, uuid, grade, price, member_price, balance, url, deliver_type, facilitator_uuid, product_name, index, query_type, preview);
      }else{
          var data=queryReport();
          if(data){
              aftersearch(data,preview,0)
          }
      }
    }
  }
}

function search_3(index,pay,preview){//api_type==3 搜索框模版查询
  var uuid = $("#uuid").val();
  if (uuid == '') {
      $('#login').modal('show');
  }else{
    // console.log(index,pay,preview)
    if(shelves_check(preview) && limited_check(preview)){
      if(pay==1){//支付
          var product_id = $('#product_id').val(), type = 'message', orderNo = '', uuid = $('#uuid').val(), grade = $('#membership_grade').val(),
              price = $('#price').val(), member_price = $('#member_price').val(),balance = $('#balance').val(),query_type = 'search_two', url='',
              facilitator_uuid = $('#facilitator_uuid').val(), product_name = '', deliver_type = '';
          payOrder(product_id, type, uuid, grade, price, member_price, balance, url, deliver_type, facilitator_uuid, product_name, index, query_type, preview);

      }else{
          var data=queryReportSearch(index)
          if(data){
              aftersearch(data,preview,1)
          }
      }
    }
  }
}

function search_information(pay,preview){//api_type==1,4,5
  var uuid = $("#uuid").val();
  if (uuid == '') {
      $('#login').modal('show');
  }else{
    if(shelves_check(preview) && limited_check(preview)){
      var form=parseform();
      if(!form){
        return false
      }
      if(pay==1){//支付

        // console.log('此处调支付流程')
          var product_id = $('#product_id').val(), type = 'message', orderNo = '', uuid = $('#uuid').val(), grade = $('#membership_grade').val(),
              price = $('#price').val(), member_price = $('#member_price').val(),balance = $('#balance').val(),query_type = 'search_list', index = '', url='',
              facilitator_uuid = $('#facilitator_uuid').val(), product_name = '', deliver_type = '', preview = '';
          payOrder(product_id, type, uuid, grade, price, member_price, balance, url, deliver_type, facilitator_uuid, product_name, index, query_type, preview);
      }else{
          var data=searchlist();
          if(data){
              if(data.code!=1001){
                //查询失败
              }
              aftersearchinformation(data,preview);
          }

      }
    }
  }
}
