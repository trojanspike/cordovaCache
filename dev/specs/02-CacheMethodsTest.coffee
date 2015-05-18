describe " Are the avail on window ", ->

  it "checks cache and crypt are avail", ->
    console.log expect ''
    expect window.Cache
    .toBeDefined()