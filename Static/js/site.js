﻿var pushToUrl = new pushToUrl();

var data = [];

async function Start() {
    data = await $.getJSON('/samples.json').fail(function () { showFailed(); });

    showSearchFromUrl();
    openSampleFromUrl();
}

// Show faild loading json file
function showFailed() {
    $("#sampleList").empty();
    $("#sampleList").append('<div class="w-100"><div class="alert alert-danger" role="alert">Sorry, was unable to load the samples from \'<strong>/samples.json</strong>\' file.</div></div>');
}

// Show all samples and categories
function showSampleCards() {
    var search = pushToUrl.get('search');
    if (!search || search === '') {
        $('#sampleList').empty();
        $.each(data.Categories, function (index, value) {
            $('#sampleList').append(`<div class="w-100"><a name="${value.Id}"></a><h3 class="fw-light">${value.Title} <small class="text-muted">(${value.NumberOfSamples})</small></h3><p>${value.Description}</p></div>`);
            $.each(value.Samples, function (index, value) {
                $('#sampleList').append(`<div class="col"><div class="card shadow-sm"><img class="card-img-top" src="${value.Path}/${value.Screenshot}" loading="lazy" alt="${value.Title}" /><div class="card-body"><h5 class="card-title">${value.Title}</h5><p class="card-text">${value.Description}</p><div class="d-flex justify-content-between align-items-center"><div class="btn-group"><button type="button" class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#sampleModal" data-bs-id="${value.Id}" data-bs-title="${value.Title}" data-bs-path="${value.Path}" data-bs-source="${data.GitHub}${value.Source}"><small>Run Sample</small></button><a href="${value.Path}" target="_blank" class="btn btn-sm btn-outline-secondary" role="button"><small>Open In New Tab</small></a><a href="${data.GitHub}${value.Source}" target="_blank" class="btn btn-sm btn-outline-secondary" role="button"><small>Source Code</small></a></div></div></div></div></div>`);
            });
        });
    }
}

// Show sample search resiult from url if any
function showSearchFromUrl() {
    var search = pushToUrl.get('search');
    if (search && search !== '') {
        search = decodeURIComponent(search);

        $('#searchBox').val(search);

        $('#sampleList').empty();
        $('#sampleList').append(`<div class="w-100"><h3 class="fw-light">Search results for <small class="text-muted">${search}</small></h3></div>`);

        var query = search.toLowerCase();
        var found = false;

        $.each(data.Categories, function (index, value) {
            $.each(value.Samples, function (index, value) {
                if (value.Title.toLowerCase().indexOf(query) >= 0 ||
                    value.Description.toLowerCase().indexOf(query) >= 0 ||
                    value.Keywords.toLowerCase().indexOf(query) >= 0) {
                    $('#sampleList').append(`<div class="col"><div class="card shadow-sm"><img class="card-img-top" src="${value.Path}/${value.Screenshot}" loading="lazy" alt="${value.Title}" /><div class="card-body"><h5 class="card-title">${value.Title}</h5><p class="card-text">${value.Description}</p><div class="d-flex justify-content-between align-items-center"><div class="btn-group"><button type="button" class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#sampleModal" data-bs-id="${value.Id}" data-bs-title="${value.Title}" data-bs-path="${value.Path}" data-bs-source="${data.GitHub}${value.Source}")"><small>Run Sample</small></button><a href="${value.Path}" target="_blank" class="btn btn-sm btn-outline-secondary" role="button"><small>Open In New Tab</small></a><a href="${data.GitHub}${value.Source}" target="_blank" class="btn btn-sm btn-outline-secondary" role="button"><small>Source Code</small></a></div></div></div></div></div>`);

                    found = true;
                }
            });
        });

        if (!found) $("#sampleList").append('<div class="w-100"><div class="alert alert-warning" role="alert">Sorry, no samples matching your search criteria were found.</div></div>');
    }
}

// Open sample from Url if any
function openSampleFromUrl() {
    var sample = pushToUrl.get('sample');
    if (sample && sample !== '') {
        var found = false;
        $.each(data.Categories, function (index, value) {
            $.each(value.Samples, function (index, value) {
                if (value.Id === sample) {
                    $('.modal-title').text(value.Title);
                    $('#sampleModalSource').attr('href', `${data.GitHub}${value.Source}`);
                    $('#sampleModalPath').attr('src', value.Path);

                    found = true;
                }
            });
        });

        if (found) $("#sampleModal").modal('show');
    }
}

// handel opening sample model
$('#sampleModal').on('show.bs.modal', function (event) {
    var button = event.relatedTarget;
    if (button) {
        $('.modal-title').text(button.getAttribute('data-bs-title'));
        $('#sampleModalSource').attr('href', button.getAttribute('data-bs-source'));
        $('#sampleModalPath').attr('src', button.getAttribute('data-bs-path'));

        pushToUrl.add({ key: 'sample', value: encodeURIComponent(button.getAttribute('data-bs-id')) });
    }
});

// handel closing sample model
$('#sampleModal').on('hide.bs.modal', function () {
    pushToUrl.remove('sample');
});

// handel search input
$('input[type=search]').on('input', function () {
    clearTimeout(this.delay);
    this.delay = setTimeout(function () {
        $(this).trigger('search');
    }.bind(this), 800);
}).on('search', function () {
    var search = $(this).val().trim();
    if (search) {
        pushToUrl.add({ key: 'search', value: encodeURIComponent(search) });
        showSearchFromUrl();
    } else {
        pushToUrl.remove('search');
        showSampleCards();
    }
});

// handel search button
$('form').submit(function (event) {
    var search = $('input[type=search]').val().trim();
    if (search) {
        $('input[type=search]').trigger('search');
    }

    event.preventDefault();
});

// Change style inside the iframe
$('#sampleModalPath').on('load', function () {
    $(this).contents().find("body").css("font-family", "Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif");
    $(this).contents().find("body").css("font-size", "14px");
});