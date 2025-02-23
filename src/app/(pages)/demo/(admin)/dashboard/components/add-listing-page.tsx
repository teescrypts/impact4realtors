"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Stack,
  Typography,
  Grid2,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { Country, IState, ICity, City, State } from "country-state-city";
import FileDropzone from "@/app/component/file-dropzone";
import {
  deleteImage,
  deleteImages,
  uploadImage,
} from "@/app/actions/server-actions";
import { DraftImgType } from "../listing/add/page";
import notify from "@/app/utils/toast";
import imageCompression from "browser-image-compression";

interface FileType extends File {
  path?: string;
}

export default function AddListingPage({
  draftImages,
}: {
  draftImages: DraftImgType[];
}) {
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const [countries] = useState(Country.getAllCountries());
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  const [imgLoading, setImgLoading] = useState(false);
  const [imgErr, setImgErr] = useState("");

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

  const handleFileRemove = useCallback(async (id: string) => {
    const result = await deleteImage(id);

    if (result?.error) setImgErr(result.error);
    if (result?.message) notify(result.message);
  }, []);

  const handleFilesRemoveAll = useCallback(async () => {
    const result = await deleteImages();

    if (result?.error) setImgErr(result.error);
    if (result?.message) notify(result.message);
  }, []);

  const handleAddFeature = () => {
    if (featureInput.trim() && !features.includes(featureInput)) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (featureToRemove: string) => {
    setFeatures(features.filter((feature) => feature !== featureToRemove));
  };

  return (
    <Box>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12 }}>
          <Typography variant="subtitle1">Basic Details</Typography>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="Property Title" variant="outlined" />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="Price" variant="outlined" />
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="Bedrooms" variant="outlined" />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="Bathrooms" variant="outlined" />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <TextField fullWidth label="Square Meters" variant="outlined" />
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Description"
            variant="outlined"
          />
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
          <Typography variant="subtitle1">Type</Typography>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select variant="outlined" label="Category">
              <MenuItem value="For Sale">For Sale</MenuItem>
              <MenuItem value="For Rent">For Rent</MenuItem>
            </Select>
          </FormControl>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Property Type</InputLabel>
            <Select label="Property Type" variant="outlined">
              <MenuItem value="House">House</MenuItem>
              <MenuItem value="Apartment">Apartment</MenuItem>
              <MenuItem value="Condo">Condo</MenuItem>
            </Select>
          </FormControl>
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select variant="outlined" label="Status">
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
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
          />
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
          <TextField
            variant="outlined"
            name="line2"
            label="Address Line 2"
            fullWidth
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
            fullWidth
          />
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
          <Typography variant="subtitle1">Features and Amenities</Typography>
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
          {features.length > 0 && (
            <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap" }}>
              {features.map((feature, index) => (
                <Chip
                  key={index}
                  label={feature}
                  onDelete={() => handleRemoveFeature(feature)}
                />
              ))}
            </Stack>
          )}
          <TextField
            variant="outlined"
            fullWidth
            label="Add Feature & Amenity"
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddFeature()}
          />
          <Button variant="contained" sx={{ mt: 1 }} onClick={handleAddFeature}>
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
            files={draftImages}
            onDrop={handleFilesDrop}
            onRemove={handleFileRemove}
            onRemoveAll={handleFilesRemoveAll}
          />
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
          <Button variant="contained" color="primary" fullWidth>
            Submit Listing
          </Button>
        </Grid2>
      </Grid2>
    </Box>
  );
}
