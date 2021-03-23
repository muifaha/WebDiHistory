<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return view('common.template');
// });

Route::get('/', 'HomeController@index')->name('home');
Route::get('/upload', 'UploadController@index')->name('upload');
Route::post('/upload', 'UploadController@store')->name('upload');

Route::get('/data', 'UploadController@create')->name('getList');
Route::get('/edit/{targetId}', 'UploadController@edit')->name('getData');
Route::post('/edit/{targetId}', 'UploadController@update')->name('getUpdate');
Route::delete('/delete/{targetId}', 'UploadController@destroy')->name('getDelete');
