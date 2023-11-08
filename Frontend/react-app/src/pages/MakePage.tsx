import React, { useEffect, useState } from "react";
import "../styles/MakePage.css";
import { gql, useMutation } from "@apollo/client";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

// const uploadImage = async (file1: File, file2: File) => {
// GraphQL mutation과 변수 정의

const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct($createProductInput: CreateProductInput!) {
    createProduct(createProductInput: $createProductInput) {
      id
      name
      description
      price
      url
      productSaleslocation {
        id
        address
        addressDetail
        lat
        lng
        mettingTime
      }
      productCategory {
        id
      }
      productTags {
        id
        name
      }
    }
  }
`;

interface MakePageProps {
  email: string;
  name: string;
  id: string;
}

const MakePage: React.FC<MakePageProps> = ({ id, name, email }) => {
  const Navigate = useNavigate();
  // const [image, setImage] = useState(null);
  // const [previewUrl, setPreviewUrl] = useState("");
  const [textData, setTextData] = useState({
    title: "",
    desc: "",
  });

  useEffect(() => {
    // 컴포넌트가 마운트될 때 초기값 설정
    setTextData({
      title: "",
      desc: "",
    });
  }, []);
  const [file1, setFile1] = useState<File | null>(null);
  const [createProduct, { data, loading, error }] = useMutation(
    CREATE_PRODUCT_MUTATION
  );
  // const [file2, setFile2] = useState<File | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTextData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // console.log(`유저ID : ${userData}`);

  // const handleUpload = () => {
  //   if (file1 && file2) {
  //     uploadImage(file1, file2);
  //     console.log("업로드 완료");
  //   }
  // };

  const uploadImage = async (file1: File) => {
    const operations = {
      query: `
        mutation UploadFile($files: [Upload!]!) { 
          uploadFile(files: $files) 
        }
      `,
      variables: {
        // files: [null, null],
        files: [null],
      },
    };

    const map = {
      "0": ["variables.files.0"],
      // "1": ["variables.files.1"],
    };

    const formData = new FormData();
    formData.append("operations", JSON.stringify(operations));
    formData.append("map", JSON.stringify(map));
    formData.append("0", file1);
    // formData.append("1", file2);

    try {
      const response = await axios.post(
        "http://localhost:4001/graphql",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-apollo-operation-name": true,
          },
        }
      );

      console.log(`이미지 경로${response.data.data.uploadFile}`);

      createProduct({
        variables: {
          createProductInput: {
            name: textData.title,
            description: textData.desc,
            price: 3000,
            url: `https://storage.googleapis.com/${response.data.data.uploadFile[0]}`,
            userName: name,
            userEmail: email,
            productSaleslocation: {
              address: "구로",
              addressDetail: "구로역",
              lat: 1.0,
              lng: 1.0,
              mettingTime: "2023-11-01",
            },
            productCategoryId: "0fe2208d-51f9-495e-8dc1-c527b3a4b8b1",
            productTags: [],
            userId: id,
          },
        },
      });
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleUpload = () => {
    if (file1) {
      uploadImage(file1);
      console.log("업로드 완료");
      Navigate(`/`);
    }
  };

  // const handleImageChange = (e: any) => {
  //   if (e.target.files && e.target.files[0]) {
  //     // FileReader 객체를 생성합니다.
  //     const reader = new FileReader();

  //     // 이미지가 로드되면 실행될 콜백 함수를 정의합니다.
  //     reader.onload = (e: ProgressEvent<FileReader>) => {
  //       const imageUrl = e.target!.result as string;
  //       // 이미지 URL을 상태에 저장합니다.
  //       setPreviewUrl(imageUrl);
  //     };

  //     // 파일을 읽어 데이터 URL을 생성합니다.
  //     reader.readAsDataURL(e.target.files[0]);

  //     // 선택된 파일을 다른 상태에 저장합니다 (업로드 용도 등).
  //     setImage(e.target.files[0]);
  //   }
  // };

  return (
    <main>
      <div className="container1">
        <input
          type="file"
          className="image_box"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setFile1(e.target.files[0]);
            }
          }}
          // onChange={handleImageChange}
        />
      </div>
      <div className="container2">
        <input
          type="text"
          name="title"
          className="title"
          placeholder="제목을 입력하세요"
          value={textData.title}
          onChange={handleInputChange}
        />
        <textarea
          name="desc"
          className="desc"
          placeholder="내용을 입력하세요"
          value={textData.desc}
          onChange={handleInputChange}
        ></textarea>
      </div>
      <div className="container3">
        <button className="add_Btn" onClick={handleUpload}>
          추가
        </button>
      </div>
    </main>
  );
};

export default MakePage;
