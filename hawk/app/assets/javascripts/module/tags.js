// Copyright (c) 2009-2015 Tim Serong <tserong@suse.com>
// See COPYING for license.

$(function() {

  $('#configs #middle table.tags, #tags #middle table.tags')
    .bootstrapTable({
      method: 'get',
      url: Routes.cib_tags_path(
        $('body').data('cib'),
        { format: 'json' }
      ),
      striped: true,
      pagination: true,
      pageSize: 25,
      pageList: [10, 25, 50, 100, 200],
      sidePagination: 'client',
      smartDisplay: false,
      search: true,
      searchAlign: 'left',
      showColumns: false,
      showRefresh: true,
      minimumCountColumns: 0,
      sortName: 'id',
      sortOrder: 'asc',
      columns: [{
        field: 'id',
        title: __('Name'),
        class: 'col-sm-4',
        sortable: true,
        switchable: false,
        clickToSelect: true
      }, {
        field: 'refs',
        title: __('Objects'),
        sortable: false,
        switchable: false,
        clickToSelect: false,
        formatter: function(value, row, index) {
          return value.join(", ");
        }
      }, {
        field: 'operate',
        title: __('Operations'),
        sortable: false,
        clickToSelect: false,
        class: 'col-sm-2',
        align: 'right',
        halign: 'right',
        events: {
          'click .delete': function (e, value, row, index) {
            e.preventDefault();
            var $self = $(this);

            $.hawkAsyncConfirm(i18n.translate('Are you sure you wish to delete %s?').fetch(row.id), function() {
              $.ajax({
                dataType: 'json',
                method: 'POST',
                data: {
                  _method: 'delete'
                },
                url: Routes.cib_tag_path(
                  $('body').data('cib'),
                  row.id,
                  { format: 'json' }
                ),

                success: function(data) {
                  if (data.success) {
                    $.growl({
                      message: data.message
                    },{
                      type: 'success'
                    });

                    $self.parents('table').bootstrapTable('refresh')
                  } else {
                    if (data.error) {
                      $.growl({
                        message: data.error
                      },{
                        type: 'danger'
                      });
                    }
                  }
                },
                error: function(xhr, status, msg) {
                  $.growl({
                    message: xhr.responseJSON.error || msg
                  },{
                    type: 'danger'
                  });
                }
              });
            });
          }
        },
        formatter: function(value, row, index) {
          var operations = []

          operations.push([
            '<a href="',
            Routes.edit_cib_tag_path(
              $('body').data('cib'),
              row.id
            ),
            '" class="edit btn btn-default btn-xs" title="',
            __('Edit'),
            '">',
            '<i class="fa fa-pencil"></i>',
            '</a> '
          ].join(''));

          operations.push([
            '<a href="',
            Routes.rename_cib_resource_path($('body').data('cib'), row.id),
            '" class="rename btn btn-default btn-xs" title="',
            __('Rename'),
            '" data-toggle="modal" data-target="#modal">',
            '<i class="fa fa-font"></i>',
            '</a> '
          ].join(''));

          operations.push([
            '<a href="',
            Routes.cib_tag_path(
              $('body').data('cib'),
              row.id
            ),
            '" class="delete btn btn-default btn-xs" title="',
            __('Delete'),
            '">',
            '<i class="fa fa-trash"></i>',
            '</a> '
          ].join(''));

          return [
            '<div class="btn-group" role="group">',
            operations.join(''),
            '</div>',
          ].join('');
        }
      }]
    });
});
