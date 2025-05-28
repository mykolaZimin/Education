// Пример шаблонов
const templates = {
  template1: "Hello! This is Template 1.",
  template2: "Greetings from Template 2.",
  template3: "This is Template 3 text.",
};

const select = document.getElementById("template");
const textarea = document.getElementById("templateText");
const phone = document.getElementById("phone");

window.onload = function () {
  let contactId;

  ZOHO.embeddedApp.on("PageLoad", function (data) {
    contactId = data.EntityId[0];
    console.log("Contact ID:", contactId);

    ZOHO.CRM.API.getRecord({
      Entity: "Contacts",
      RecordID: contactId,
    }).then(function (data) {
      console.log(data.data[0].Phone);
      phone.value = data.data[0].Phone;
    });
  });

  ZOHO.embeddedApp.init();
};

select.addEventListener("change", () => {
  const selectedValue = select.value;
  textarea.value = templates[selectedValue] || "";
});

document.getElementById("sendBtn").addEventListener("click", () => {
  alert(`Sending SMS:\n${textarea.value}\n${phone.value}`);

  // Логика отправки
  const url = "https://api.turbosms.ua/message/send.json"; // URL эндпойнта

  const data = {
    recipients: [`${phone.value}`],
    sms: {
      sender: "IT Alarm",
      text: `${textarea.value}`,
    },
  };

  console.log(JSON.stringify(data));

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer e8385a2a7093147b6233d3ccfe6388a8a70a5bb7",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Ошибка при запросе: " + response.status);
      }
      return response.json(); // Получаем ответ как JSON
    })
    .then((result) => {
      console.log("Успешно:", result);
    })
    .catch((error) => {
      console.error("Ошибка:", error);
    });
});
