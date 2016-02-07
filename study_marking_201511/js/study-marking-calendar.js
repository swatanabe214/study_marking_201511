// 初期表示
$(document).ready(function(){

	var jsonData = [];

	// JSONデータ作成
	$.get('schedule.json', function(data) {
		try {
			var parseJson = $.parseJSON(data);

			$.each(parseJson, function(key, value) {
				$.each(value, function(key2, value2) {
					var title = value2;
					var start = key + '/' + key2;
					var jsonText ='{"title": "' + title + '", "start":"' + start + '"}';
					jsonData.push($.parseJSON(jsonText));
				});
			});
		} catch(e) {
			alert('スケジュールの形式が不正です。');
		}
	})
	.fail(function(jqxhr, status, error) {
		alert('スケジュールファイルが読み込めません。');
	});

	// カレンダー用のオブジェクト用意
	var cal = '<input type="text" id="cal" readonly="readonly">';
	$("#calendar").before(cal);

	// 用意したカレンダーにdatepickerをセット
	$('#cal').datepicker({
		format: 'yyyy/mm',
		language: 'ja',
		autoclose : true,
		minViewMode: 'months'
	});

	// $.eachの呼ばれるタイミングが遅いため、カレンダー作成を遅延実行する
	setTimeout(function(){

		// FullCalendar作成
		$("#calendar").fullCalendar({

			// ヘッダーのタイトルとボタン
			header: {
				left: 'prev,next today',
				center: 'title',
				right: ''
			},

			// タイトル部定義
			titleFormat: {
				month: 'YYYY年 M月',
				week: 'YYYY年 M月 D日',
				day: 'YYYY年 M月 D日 dddd'
			},

			// カラム書式
			columnFormat: {
				month: 'ddd',
				week: 'D[(]ddd[)]',
				day: 'D[(]ddd[)]'
			},

			// more表示の書式
			dayPopoverFormat:'YYYY/M月/D日[(]ddd[)]',

			// 曜日名称
			dayNames: ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'],
			dayNamesShort: ['日','月','火','水','木','金','土'],

			// ボタン文字列
			buttonText: {
				prev: '<',
				next: '>',
				prevYear: '<<',
				nextYear: '>>',
				today: '今日',
				month: '月',
				week: '週',
				day: '日'
			},

			// 日付押下時イベント
			dayClick: function(date, jsEvent, view) {
				var thisMonth = (view.title).replace('年', '/').replace('月', '/01');
				thisMonth = new Date(thisMonth);
				var momentMonth = new Date(moment(date));
				if(thisMonth.getMonth() == momentMonth.getMonth()) {
					alert(moment(date).format('YYYY/MM/DD[(]ddd[)]') + ' がクリックされました。');
				}
			},

			// 予定
			events: jsonData

		});
	}, 500);

	// 月遷移（前月）イベント
	$('#textLeft').on('click', prev);

	// 月遷移（翌月）イベント
	$('#textRight').on('click', next);

	// datepickerの変更イベントを拾ってカレンダー変更
	$('#cal').on('change', gotoDate);

	// 月遷移（前月）
	function prev() {
		$("#calendar").fullCalendar('prev');
	}

	// 月遷移（翌月）
	function next() {
		$("#calendar").fullCalendar('next');
	}

	// 月変更
	function gotoDate() {
		if(new Date($('#cal').val() + "/01") > new Date('2100/12/31') || new Date($('#cal').val() + "/01") < new Date('1900/01/01')) {
			alert('選択日付が出力可能範囲外です。');
		}
		else {
			$("#calendar").fullCalendar('gotoDate', $('#cal').val() + "/01");
		}
	}

	// 土日の文字色を変更
	$('.fc-sat').css('color', 'blue');
	$('.fc-sun').css('color', 'red');
});
