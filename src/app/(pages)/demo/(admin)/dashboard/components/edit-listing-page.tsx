"use client";

import { useActionState, useCallback, useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Typography,
  Grid2,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { Country, IState, ICity, City, State } from "country-state-city";
import FileDropzone from "@/app/component/file-dropzone";
import {
  deleteImage,
  updateProperty,
  uploadImage,
} from "@/app/actions/server-actions";
import { DraftImgType } from "../listing/add/page";
import notify from "@/app/utils/toast";
import { ActionStateType, PropertyType } from "@/types";
import { SubmitButton } from "@/app/component/submit-buttton";
import { useRouter } from "nextjs-toploader/app";

interface FileType extends File {
  path?: string;
}

const initialState: ActionStateType = null;

export default function EditListingPage({
  property,
  draftImages,
}: {
  property: PropertyType;
  draftImages: DraftImgType[];
}) {
  const [features, setFeatures] = useState<string[]>(property.features);
  const [featureInput, setFeatureInput] = useState("");
  const [images, setImages] = useState<DraftImgType[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<string | null>(
    property.location.countryCode
  );
  const [selectedState, setSelectedState] = useState<string | null>(
    property.location.stateCode
  );
  const [selectedCity, setSelectedCity] = useState<string | null>(
    property.location.cityName
  );

  const [countries] = useState(Country.getAllCountries());
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  const [imgLoading, setImgLoading] = useState(false);
  const [imgErr, setImgErr] = useState("");

  useEffect(() => {
    const combinedImages = [...property.images, ...draftImages];
    setImages(combinedImages);
  }, [draftImages, property]);

  useEffect(() => {
    if (selectedCountry) {
      setStates(State.getStatesOfCountry(selectedCountry));
    } else {
      setStates([]);
    }

    if (selectedCountry && selectedState) {
      setCities(City.getCitiesOfState(selectedCountry, selectedState));
    } else {
      setCities([]);
    }
  }, [selectedCountry, selectedState]);

  const handleFilesDrop = useCallback(async (newFiles: FileType[]) => {
    setImgLoading(true);

    for (let i = 0; i < newFiles.length; i++) {
      if (newFiles[i]) {
        const formData = new FormData();
        formData.append("file", newFiles[i]);
        formData.append("type", "listing");

        const result = await uploadImage(formData);

        if (result.error) {
          setImgLoading(false);
          setImgErr(result.error);
        }
      }
    }

    setImgLoading(false);
  }, []);

  const handleFileRemove = useCallback(
    async (id: string) => {
      const result = await deleteImage(id, property._id);

      if (result?.error) setImgErr(result.error);
      if (result?.message) notify(result.message);
    },
    [property]
  );

  const handleAddFeature = () => {
    if (featureInput.trim() && !features.includes(featureInput)) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (featureToRemove: string) => {
    setFeatures(features.filter((feature) => feature !== featureToRemove));
  };

  const router = useRouter();
  const [message, setMessage] = useState("");

  const updatePropertyAction = updateProperty.bind(null, features, images);
  const [state, formAction] = useActionState(
    updatePropertyAction,
    initialState
  );

  useEffect(() => {
    if (state) {
      if (state?.message) router.push("/demo/dashboard/listing");
      if (state?.error) setMessage(state?.error);
    }
  }, [state, router]);

  return (
    <Box>
      <form action={formAction}>
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12 }}>
            <Typography variant="subtitle1">Basic Details</Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <input defaultValue={property._id} hidden name="id" />
            <TextField
              fullWidth
              label="Property Title"
              variant="outlined"
              name="propertyTitle"
              required
              type="text"
              defaultValue={property.propertyTitle}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Price"
              variant="outlined"
              name="price"
              required
              type="number"
              defaultValue={property.price}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Bedrooms"
              variant="outlined"
              name="bedrooms"
              type="number"
              required
              defaultValue={property.bedrooms}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Bathrooms"
              variant="outlined"
              name="bathrooms"
              type="number"
              required
              defaultValue={property.bathrooms}
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Square Meters"
              variant="outlined"
              name="squareMeters"
              type="number"
              required
              defaultValue={property.squareMeters}
            />
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Description"
              variant="outlined"
              type="text"
              name="description"
              required
              defaultValue={property.description}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                variant="outlined"
                label="Category"
                name="category"
                defaultValue={property.category}
              >
                <MenuItem value="For Sale">For Sale</MenuItem>
                <MenuItem value="For Rent">For Rent</MenuItem>
              </Select>
            </FormControl>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Property Type"
              variant="outlined"
              name="propertyType"
              type="text"
              required
              defaultValue={property.propertyType}
            />
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                variant="outlined"
                label="Status"
                name="status"
                defaultValue={property.status}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Rented">Rented</MenuItem>
                <MenuItem value="Sold">Sold</MenuItem>
              </Select>
            </FormControl>
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <Typography variant="subtitle1">Location</Typography>
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <TextField
              required
              variant="outlined"
              name="line1"
              label="Address Line 1"
              fullWidth
              defaultValue={property.location.addressLine1}
            />
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <TextField
              variant="outlined"
              name="line2"
              label="Address Line 2"
              fullWidth
              defaultValue={property.location.addressLine2}
            />
          </Grid2>

          <Grid2 size={{ xs: 6 }}>
            <Autocomplete
              options={countries}
              getOptionLabel={(option) => option.name}
              value={
                countries.find(
                  (country) => country.isoCode === selectedCountry
                ) || null
              }
              onChange={(event, newValue) => {
                setSelectedCountry(newValue ? newValue.isoCode : null);
                setSelectedState(null);
                setSelectedCity(null);
              }}
              renderInput={(params) => (
                <>
                  <TextField
                    required
                    {...params}
                    label="Country"
                    name="countryName"
                    variant="outlined"
                    fullWidth
                  />
                  <input
                    type="hidden"
                    name="countryCode"
                    value={selectedCountry || ""}
                  />
                </>
              )}
            />
          </Grid2>

          <Grid2 size={{ xs: 6 }}>
            <Autocomplete
              options={states}
              getOptionLabel={(option) => option.name}
              value={
                states.find((state) => state.isoCode === selectedState) || null
              }
              onChange={(event, newValue) => {
                setSelectedState(newValue ? newValue.isoCode : null);
                setSelectedCity(null);
              }}
              renderInput={(params) => (
                <>
                  <TextField
                    required
                    {...params}
                    label="State"
                    name="stateName"
                    variant="outlined"
                    fullWidth
                  />
                  <input
                    type="hidden"
                    name="stateCode"
                    value={selectedState || ""}
                  />
                </>
              )}
              disabled={!selectedCountry}
            />
          </Grid2>

          {/* City Autocomplete */}
          <Grid2 size={{ xs: 6 }}>
            <Autocomplete
              options={cities}
              getOptionLabel={(option) => option.name}
              value={cities.find((city) => city.name === selectedCity) || null}
              onChange={(event, newValue) => {
                setSelectedCity(newValue ? newValue.name : null);
              }}
              renderInput={(params) => (
                <>
                  <TextField
                    {...params}
                    label="City"
                    name="cityName"
                    variant="outlined"
                    fullWidth
                  />
                  <input
                    type="hidden"
                    name="cityCode"
                    value={selectedCity || ""}
                  />
                </>
              )}
              disabled={!selectedState}
            />
          </Grid2>

          <Grid2 size={{ xs: 6 }}>
            <TextField
              variant="outlined"
              name="postalCode"
              label="Postal Code"
              required
              fullWidth
              defaultValue={property.location.postalCode}
            />
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <Typography variant="subtitle1">Features and Amenities</Typography>
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            {features.length > 0 && (
              <Grid2 container spacing={2} sx={{ mb: 2 }}>
                {features.map((feature, index) => (
                  <Grid2 key={index} size={{ xs: 3, md: 3 }}>
                    <Chip
                      label={feature}
                      onDelete={() => handleRemoveFeature(feature)}
                    />
                  </Grid2>
                ))}
              </Grid2>
            )}
            <TextField
              variant="outlined"
              fullWidth
              label="Add Feature & Amenity"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddFeature()}
            />
            <Button
              variant="contained"
              sx={{ mt: 1 }}
              onClick={handleAddFeature}
            >
              Add Feature
            </Button>
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <Typography variant="subtitle1">Images</Typography>
          </Grid2>

          <Grid2 size={{ xs: 12 }}>{imgLoading && <CircularProgress />}</Grid2>

          <Grid2 size={{ xs: 12 }}>
            <Typography variant="subtitle2" color="error">
              {imgErr}
            </Typography>
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <FileDropzone
              accept={{ "image/*": [] }}
              caption="(SVG, JPG, or PNG. Ensure product is well centeered in the photo)"
              files={images}
              onDrop={handleFilesDrop}
              onRemove={handleFileRemove}
              isEdit={true}
            />
          </Grid2>

          {message && (
            <Typography variant="subtitle2" color="error" textAlign={"center"}>
              {message}
            </Typography>
          )}

          <Grid2 size={{ xs: 12 }}>
            <SubmitButton title="Save Edit" isFullWidth={true} />
          </Grid2>
        </Grid2>
      </form>
    </Box>
  );
}
