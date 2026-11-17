$(function () {
  const models = {
    Classic: {
      sizes: [{ label: "960 × 2060", price: 90941 }, { label: "860 × 2060", price: 92885 }],
      street: "Graphite",
      home: "White"
    },
    Modern: {
      sizes: [{ label: "860 × 2050", price: 140000 }, { label: "960 × 2050", price: 155000 }],
      street: "Walnut",
      home: "White"
    }
  };

  // extra: price added to the door when this colour is not the standard one for the model (set by Kali Group)
  const streetColours = [
    { name: "Graphite", hex: "#2b2b2b", material: "Powder-coated steel", extra: 0 },
    { name: "Walnut", hex: "#8a5a2b", material: "Walnut veneer", extra: 15000 },
    { name: "Oak", hex: "#b9895b", material: "Oak veneer", extra: 12000 },
    { name: "Forest", hex: "#3f5a47", material: "Matte enamel on steel", extra: 8000 },
    { name: "White", hex: "#f1ece2", material: "White enamel on steel", extra: 5000 }
  ];
  const homeColours = [
    { name: "White", hex: "#f1ece2", material: "White MDF panel", extra: 0 },
    { name: "Light grey", hex: "#d3d0ca", material: "Grey MDF panel", extra: 3000 },
    { name: "Oak", hex: "#b9895b", material: "Oak veneer", extra: 8000 },
    { name: "Walnut", hex: "#8a5a2b", material: "Walnut veneer", extra: 10000 }
  ];
  const handleColours = [
    { name: "Brass", hex: "#c9a227", material: "Brass-plated steel", extra: 0 },
    { name: "Graphite", hex: "#2b2b2b", material: "Matte black steel", extra: 0 },
    { name: "Steel", hex: "#b8bcc2", material: "Stainless steel", extra: 4000 }
  ];

  const state = {
    model: "Classic",
    sizeIndex: 0,
    street: "Graphite",
    home: "White",
    handle: "Brass",
    handleSide: "left"
  };

  const $door = $("#cfgDoor");

  function findColour(list, name) {
    return list.find(colour => colour.name === name);
  }

  function renderSwatches(containerId, groupName, list, selected, standardName) {
    const $container = $("#" + containerId).empty();
    list.forEach(function (colour) {
      const label = el("label", "choice swatch");
      const input = el("input");
      input.type = "radio";
      input.name = groupName;
      input.value = colour.name;
      input.checked = colour.name === selected;

      const dot = el("span", "swatch-dot");
      dot.style.backgroundColor = colour.hex;
      const extra = colour.name === standardName ? 0 : colour.extra;
      const priceText = extra === 0 ? "Included" : "+ " + formatPrice(extra);

      const text = el("span", "swatch-text");
      text.append(
        el("span", "swatch-name", colour.name),
        el("span", "swatch-info", colour.material),
        el("span", "swatch-info swatch-price", priceText)
      );
      label.append(input, dot, text);
      $container.append(label);
    });
  }

  function renderSizes() {
    const $select = $("#sizeSelect").empty();
    models[state.model].sizes.forEach(function (size, index) {
      const option = el("option", "", size.label + " mm");
      option.value = index;
      $select.append(option);
    });
    $select.val(state.sizeIndex);
  }

  function getExtra(list, name, standardName) {
    const colour = findColour(list, name);
    return name === standardName ? 0 : colour.extra;
  }

  function getOptionsPrice() {
    return getExtra(streetColours, state.street, models[state.model].street) +
           getExtra(homeColours, state.home, models[state.model].home) +
           getExtra(handleColours, state.handle, "Brass");
  }

  function getPrice() {
    return models[state.model].sizes[state.sizeIndex].price + getOptionsPrice();
  }

  function update() {
    const size = models[state.model].sizes[state.sizeIndex];

    $door.toggleClass("is-modern", state.model === "Modern");
    $door.toggleClass("handle-right", state.handleSide === "right");
    $door[0].style.setProperty("--street", findColour(streetColours, state.street).hex);
    $door[0].style.setProperty("--home", findColour(homeColours, state.home).hex);
    $door[0].style.setProperty("--handle", findColour(handleColours, state.handle).hex);

    $("#sumModel").text(state.model);
    $("#sumSize").text(size.label + " mm");
    $("#sumStreet").text(state.street);
    $("#sumHome").text(state.home);
    $("#sumHandle").text(state.handle + ", on the " + state.handleSide);
    $("#sumPrice").text(formatPrice(getPrice()));
    $("#sumNote").text(getOptionsPrice() === 0
      ? "Standard colours and handle: this price is final."
      : "Door " + formatPrice(size.price) + " + colours and handle " + formatPrice(getOptionsPrice()) + ". The master confirms the final price when he measures.");
  }

  function setView(view) {
    $door.toggleClass("show-home", view === "home");
    $(".view-btn").each(function () {
      $(this).attr("aria-pressed", String($(this).attr("data-view") === view));
    });
  }

  $("#modelChoices").on("change", "input", function () {
    state.model = this.value;
    state.sizeIndex = 0;
    state.street = models[state.model].street;
    state.home = models[state.model].home;
    renderSizes();
    renderSwatches("streetSwatches", "street", streetColours, state.street, models[state.model].street);
    renderSwatches("homeSwatches", "home", homeColours, state.home, models[state.model].home);
    update();
  });

  $("#sizeSelect").on("change", function () {
    state.sizeIndex = Number(this.value);
    update();
  });

  $("#streetSwatches").on("change", "input", function () {
    state.street = this.value;
    update();
    setView("street");
  });

  $("#homeSwatches").on("change", "input", function () {
    state.home = this.value;
    update();
    setView("home");
  });

  $("#handleSwatches").on("change", "input", function () {
    state.handle = this.value;
    update();
  });

  $("#handleSideChoices").on("change", "input", function () {
    state.handleSide = this.value;
    update();
  });

  $(".view-btn").on("click", function () {
    setView($(this).attr("data-view"));
  });

  $("#addConfig").on("click", function () {
    const size = models[state.model].sizes[state.sizeIndex];
    const key = [state.model, size.label, state.street, state.home, state.handle, state.handleSide].join("-").replace(/\s+/g, "");
    Cart.add({
      id: "cfg-" + key,
      name: state.model + " door, your design",
      details: size.label + " mm. Street: " + state.street + ", home: " + state.home + ". " + state.handle + " handle on the " + state.handleSide + ".",
      price: getPrice()
    });
    showToast("Your door is added to the order");
  });

  renderSizes();
  renderSwatches("streetSwatches", "street", streetColours, state.street, models[state.model].street);
  renderSwatches("homeSwatches", "home", homeColours, state.home, models[state.model].home);
  renderSwatches("handleSwatches", "handle", handleColours, state.handle, "Brass");
  update();
});
