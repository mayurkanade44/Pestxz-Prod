import Report from "../models/Report.js";
import Location from "../models/Location.js";
import Company from "../models/Company.js";
import mongoose from "mongoose";
import exceljs from "exceljs";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import axios from "axios";
import PdfPrinter from "pdfmake";
import sgMail from "@sendgrid/mail";

export const addRecord = async (req, res) => {
  const { action } = req.body;
  const { id } = req.params;
  try {
    if (!action || !action.length)
      return res.status(400).json({ msg: "Please select appropriate options" });

    const locationExists = await Location.findById(id);
    if (!locationExists)
      return res
        .status(404)
        .json({ msg: "Given location not found, contact admin" });

    const images = [];
    if (req.files) {
      let temp = [],
        uploaded = req.body.uploaded;
      if (req.files.image.length > 1) temp = req.files.image;
      else temp.push(req.files.image);
      for (let i = 0; i < uploaded.length; i++) {
        if (uploaded[i] === "false") images.push("false");
        else images.push(temp.shift());
      }
    }

    let address = "Location Access Not Provided";

    const cord = req.body.coordinates[1] || false;
    if (cord) {
      const { data } = await axios.get(
        `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${cord}&apiKey=${process.env.HERE_API_KEY}`
      );
      address = data.items[0].title;
    }

    const reportData = [];
    for (let i = 1; i < req.body.id.length; i++) {
      let temp = {};
      if (req.body.action[i] === "false") continue;
      temp.id = req.body.id[i];
      temp.serviceId = req.body.serviceId[i];
      temp.serviceName = req.body.serviceName[i];
      temp.action = req.body.action[i];
      temp.value = req.body.value[i];
      temp.comment = req.body.comment[i];
      temp.address = address;
      if (req.body.uploaded[i] === "true") {
        const result = await cloudinary.uploader.upload(
          images[i].tempFilePath,
          {
            use_filename: true,
            folder: "Pestxz",
            quality: 30,
          }
        );
        temp.image = result.secure_url;
        fs.unlinkSync(images[i].tempFilePath);
      }
      reportData.push(temp);
    }
    req.body.shipTo = locationExists.shipTo;
    req.body.location = id;
    req.body.user = req.user.userId;
    req.body.reportData = reportData;

    await Report.create(req.body);
    return res.status(201).json({ msg: "Record has been saved" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const generateServiceReport = async (req, res) => {
  const { shipTo, fromDate, toDate, serviceId, location, floor, user } =
    req.query;
  try {
    if (!shipTo)
      return res.status(400).json({ msg: "Please select premises." });

    let endDate = new Date(toDate);
    endDate.setDate(endDate.getDate() + 1);

    const query = [
      {
        $lookup: {
          from: "shiptos",
          localField: "shipTo",
          foreignField: "_id",
          as: "shipTo",
        },
      },
      {
        $unwind: "$shipTo",
      },
      {
        $match: {
          "shipTo._id": new mongoose.Types.ObjectId(shipTo),
        },
      },
      { $unwind: "$reportData" },
      {
        $lookup: {
          from: "locations",
          localField: "location",
          foreignField: "_id",
          as: "location",
        },
      },
      {
        $unwind: "$location",
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $match: {
          createdAt: {
            $gte: new Date(fromDate),
            $lte: endDate,
          },
        },
      },
    ];

    if (user && user !== "All")
      query.push({ $match: { "user._id": new mongoose.Types.ObjectId(user) } });
    if (serviceId && serviceId !== "All")
      query.push({ $match: { "reportData.serviceId": serviceId } });
    if (location && location !== "All") {
      query.push({
        $match: {
          "location._id": new mongoose.Types.ObjectId(location),
        },
      });
    }

    query.push({
      $project: {
        _id: 0,
        shipTo: "$shipTo.shipToName",
        floor: "$location.floor",
        location: "$location.location",
        services: "$reportData",
        user: "$user",
        createdAt: 1,
      },
    });

    const data = await Report.aggregate(query);

    if (data.length === 0)
      return res
        .status(400)
        .json({ msg: "No data not found on selected fields" });

    const workbook = new exceljs.Workbook();
    let worksheet = workbook.addWorksheet("Sheet1");

    worksheet.columns = [
      { header: "Premises", key: "shipTo" },
      { header: "Date/Time", key: "time" },
      { header: "Floor", key: "floor" },
      { header: "Location", key: "location" },
      { header: "Service/Product", key: "service" },
      { header: "Activity", key: "activity" },
      { header: "Value", key: "value" },
      { header: "Operator Comment", key: "comment" },
      { header: "Operator Location", key: "address" },
      { header: "Image Link", key: "image" },
      { header: "Serviced By", key: "user" },
    ];

    data.map((item) => {
      worksheet.addRow({
        shipTo: item.shipTo,
        time: new Date(item.createdAt).toLocaleString(undefined, {
          timeZone: "Asia/Kolkata",
        }),
        floor: item.floor,
        location: item.location,
        service: item.services.serviceName,
        activity: item.services.action,
        value: item.services.value,
        comment: item.services.comment,
        address: item.services.address,
        image: item.services.image && {
          text: "Service Image",
          hyperlink: item.services.image,
        },
        user: item.user.name,
      });
    });

    await workbook.xlsx.writeFile(`./files/${data[0].shipTo}.xlsx`);

    const result = await cloudinary.uploader.upload(
      `files/${data[0].shipTo}.xlsx`,
      {
        resource_type: "raw",
        use_filename: true,
        folder: "Pestxz",
      }
    );

    fs.unlinkSync(`./files/${data[0].shipTo}.xlsx`);

    return res
      .status(200)
      .json({ msg: "Report has been generated.", link: result.secure_url });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const weeklyReport = async (req, res) => {
  try {
    const finalData = [];
    const today = new Date();
    const today1 = new Date();
    const fromDate = new Date(today1.setDate(today1.getDate() - 7));
    const endDate = new Date(today.setDate(today.getDate() + 1));

    const companies = await Company.find();
    const companyName = companies[0].companyName;

    const allLocations = await Location.find({
      shipTo: "6443bb09813966fb28549643",
    })
      .populate({
        path: "services.service",
        select: "serviceName productName",
      })
      .select("floor location services.count");

    const data1 = await Report.aggregate([
      {
        $lookup: {
          from: "shiptos",
          localField: "shipTo",
          foreignField: "_id",
          as: "shipTo",
        },
      },
      {
        $unwind: "$shipTo",
      },
      {
        $match: {
          "shipTo._id": new mongoose.Types.ObjectId("6443bb09813966fb28549643"),
        },
      },
      { $unwind: "$reportData" },
      {
        $lookup: {
          from: "locations",
          localField: "location",
          foreignField: "_id",
          as: "location",
        },
      },
      {
        $unwind: "$location",
      },
      {
        $match: {
          createdAt: {
            $gte: fromDate,
            $lte: endDate,
          },
        },
      },
      {
        $project: {
          _id: 0,
          client: { name: "$shipTo.shipToName", email: "$shipTo.shipToEmail" },
          location: "$location._id",
          services: "$reportData",
          createdAt: 1,
        },
      },
    ]);

    for (let i = 0; i < allLocations.length; i++) {
      for (let j = 0; j < allLocations[i].services.length; j++) {
        let temp = allLocations[i].services[j];
        const serv = [
          temp.service.serviceName ||
            temp.service.productName + " - " + temp.count,
          "-",
          "-",
          "-",
          "-",
          "-",
          "-",
          "-",
          temp.service.id,
        ];
        if (j === 0) {
          finalData.push({
            id: allLocations[i].id,
            floor: allLocations[i].floor,
            location: allLocations[i].location,
            services: [serv],
          });
        } else finalData[i].services.push(serv);
      }
    }

    for (let i = 0; i < finalData.length; i++) {
      for (let j = 0; j < data1.length; j++) {
        if (finalData[i].id === data1[j].location.toString()) {
          for (let k = 0; k < finalData[i].services.length; k++) {
            if (finalData[i].services[k][8] === data1[j].services.serviceId) {
              if (data1[j].createdAt.getDay() === 0) {
                finalData[i].services[k][7] = data1[j].services.action;
              } else
                finalData[i].services[k][data1[j].createdAt.getDay()] =
                  data1[j].services.action;
            }
          }
        }
      }
    }

    const date = `From ${fromDate.toISOString().split("T")[0]} To ${
      new Date(endDate.setDate(endDate.getDate() - 2))
        .toISOString()
        .split("T")[0]
    }`;

    const link = await generatePDF({
      data: finalData,
      clintName: data1[0].client.name,
    });

    const mailData = {
      link,
      name: data1[0].client.name,
      email: data1[0].client.email,
      date,
      company: companyName,
    };

    const mail = await sendEmail(mailData);

    if (mail) return res.status(200).json({ msg: "Report successfully sent" });

    return res
      .status(400)
      .json({ msg: "There is some error, Try again later" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const generatePDF = async ({ data, clintName }) => {
  try {
    const docDefinition = {
      content: [{ text: `Weekly Report Of ${clintName}`, style: "header" }],
    };

    for (let i = 0; i < data.length; i++) {
      const temp = [
        [
          { text: "Type Of Work", style: "tableHeader" },
          { text: "Mon", style: "tableHeader" },
          { text: "Tue", style: "tableHeader" },
          { text: "Wed", style: "tableHeader" },
          { text: "Thu", style: "tableHeader" },
          { text: "Fri", style: "tableHeader" },
          { text: "Sat", style: "tableHeader" },
          { text: "Sun", style: "tableHeader" },
        ],
      ];
      for (let j = 0; j < data[i].services.length; j++) {
        const service = Object.values(data[i].services[j]);
        service.pop();
        temp.push(service);
      }
      docDefinition["content"].push(
        {
          text: [
            { text: "Location - ", bold: true },
            `${data[i].floor} / ${data[i].location}`,
          ],
          style: "subheader",
        },
        {
          style: "tableExample",
          table: {
            headerRows: 1,
            body: temp,
          },
        }
      );
    }

    docDefinition.styles = {
      header: {
        fontSize: 18,
        color: "#003893",
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 30],
      },
      subheader: {
        margin: [0, 0, 0, 5],
      },
      tableExample: {
        alignment: "center",
        margin: [0, 0, 0, 25],
        fontSize: 10,
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
      },
    };

    const fonts = {
      Roboto: {
        normal: "./fonts/Roboto-Regular.ttf",
        bold: "./fonts/Roboto-Bold.ttf",
      },
    };

    const printer = new PdfPrinter(fonts);

    var pdfDoc = printer.createPdfKitDocument(docDefinition, {});
    let writeStream = fs.createWriteStream(`./files/${clintName}.pdf`);
    pdfDoc.pipe(writeStream);
    pdfDoc.end();

    const result = await cloudinary.uploader.upload(
      `./files/${clintName}.pdf`,
      {
        resource_type: "raw",
        use_filename: true,
        folder: "Pestxz",
      }
    );
    fs.unlinkSync(`./files/${clintName}.pdf`);
    return result.secure_url;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const sendEmail = async (mailData) => {
  try {
    const fileType = mailData.link.split(".").pop();
    const result = await axios.get(mailData.link, {
      responseType: "arraybuffer",
    });
    const base64File = Buffer.from(result.data, "binary").toString("base64");

    const attachObj = {
      content: base64File,
      filename: `${mailData.name}.${fileType}`,
      type: `application/${fileType}`,
      disposition: "attachment",
    };
    const attach = [attachObj];

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: mailData.email,
      from: { email: "noreply.epcorn@gmail.com", name: mailData.company },
      dynamic_template_data: {
        name: mailData.name,
        date: mailData.date,
        company: mailData.company,
      },
      template_id: "d-658ff3504861472fbdc0ec1419af4869",
      attachments: attach,
    };

    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
