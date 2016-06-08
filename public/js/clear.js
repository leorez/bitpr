(function () {
  'use strict';

  $(document).ready(function() {
    $('.has-clear input').on('change', function() {
      if ($(this).val() == '') {
        $(this).parents('.form-group').addClass('has-empty-value');
      } else {
        $(this).parents('.form-group').removeClass('has-empty-value');
      }
    }).trigger('change');

    $('.has-clear .form-control-clear').on('click', function() {
      var $input = $(this).parents('.form-group').find('input');

      $input.val('').trigger('change');

      // Trigger a "cleared" event on the input for extensibility purpose
      $input.trigger('cleared');
    });
  });

}());

