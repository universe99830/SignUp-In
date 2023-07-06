import React, { useState, useEffect } from 'react'
import algosdk from 'algosdk';
import { algodClient } from '../../main/Mint/Lib/algorand'
import { base58btc } from 'multiformats/bases/base58';
import NoResultImg from '../../../assets/images/no-results.png'
import { Modal } from '../../shared';
import { ListDialog } from './ListDialog'
import MultiSwitch from 'react-switch';
import { useApi } from '../../../contexts/ApiContext'
import {
    PriceListContainer,
    Button
} from './styles'
import { SpinnerLoader } from '../../shared/SpinnerLoader';
import { toast } from 'react-toastify';

export const SetPricelist = () => {
    const [NFTLists, setNFTLists] = useState([]);
    const [NFTitem, setNFTitem] = useState([]);
    const [ethRate, setEthRate] = useState(1)
    const [algoRate, setAlgoRate] = useState(1)
    const [maticRate, setMaticRate] = useState(1)
    const [isList, setIsList] = useState(false)
    const [{ doPost, getRole }] = useApi()
    const [isMultiImport, setIsMultiImport] = useState(false);
    const [selectedId, setSelectedId] = useState([]);
    const [isLoading,setIsLoading] = useState(true)

    const handleChange = val => {
        setIsMultiImport(val)
    }

    const getCID = (reserve) => {
        const data = algosdk.decodeAddress(reserve)
        let newArray = new Uint8Array(34);

        newArray[0] = 18;
        newArray[1] = 32;
        let i = 2;
        data.publicKey.forEach((byte) => {
            newArray[i] = byte;
            i++;
        });
        let encoded = base58btc.baseEncode(newArray);
        return encoded
    }

    const LoadNFTs = async (asset_id) => {
        try {
            const asset_info = await algodClient.getAssetByID(asset_id).do()
            let cid = asset_info.params.url?.substring(7);
            if (asset_info.params.reserve) {
                const reserveURL = asset_info.params.reserve
                cid = getCID(reserveURL)
            }
            var NFT_metadata = {}
            NFT_metadata['unit_name'] = asset_info.params['unit-name']
            if (asset_info.params['decimals'] > 0 && NFT_metadata['unit_name'] == "BRT" || NFT_metadata['unit_name'] == "USDC") return NFT_metadata;
            NFT_metadata['name'] = asset_info.params['name']
            NFT_metadata['url'] = 'https://ipfs.io/ipfs/' + cid
            NFT_metadata['id'] = asset_id
            return NFT_metadata;
        } catch (error) {
            console.log(error)
        }

    }

    const getAssetByAlgoAddress = async () => {
        const platformAddress = localStorage.getItem('address');
        if (platformAddress) {
            const clientInfo = await algodClient.accountInformation(platformAddress).do();
            const assets = clientInfo.assets
            var asset_list = []
            for (var asset of assets) {
                if (asset['amount'] > 0) {
                    const asset_map = await LoadNFTs(asset['asset-id'])
                    if (asset_map['name']) {
                        asset_map['amount'] = asset['amount']
                        asset_map['address'] = platformAddress
                        asset_list.push(asset_map)
                    }
                }
            }

            const response = await doPost('membership/getPlatformNFTlist', { address: platformAddress })
            var NFTLIST = response.result
            var res = asset_list.filter((els) => {
                var shouldRemain = true;
                NFTLIST.forEach(e => {
                    if ((e.NFTID == els.id.toString()) && e.listed && shouldRemain) {
                        shouldRemain = false;
                    }
                })
                return shouldRemain
            })

            setNFTLists(res)
            console.log(res, "result")
            setIsLoading(false)
            // fetch(platformAddress);
            // fetch("FROHQYWT337URQOKHDSKB4YRUGA3KSWIGMLVP4WPY6OMMTBQO36IL3WGSA")
        } else {
            setNFTLists([])
            setIsLoading(false)
        }
        return;
    }

    function checkIfImageExists(url) {
        const img = new Image();
        img.src = url;

        if (img.complete) {
            return true;
        } else {
            img.onload = () => {
                return true;
            };

            img.onerror = () => {
                return false;
            };
        }
    }

    const clickItem = (id) => {
        if (isMultiImport) {
            let length = NFTLists?.length;
            let tmplist = [];
            if (length) {
                let length1 = selectedId.length;
                if (length1 < length) {
                    for (let i = 0; i < length; i++) {
                        if (i == id) {
                            tmplist.push(true)
                        } else {
                            tmplist.push(false)
                        }
                    }
                } else {
                    for (let i = 0; i < length; i++) {
                        if (i == id) {
                            tmplist.push(!selectedId[i])
                        } else {
                            tmplist.push(selectedId[i])
                        }
                    }
                }
            }
            setSelectedId(tmplist);
        }
    }
 
    const handlemultiList = async () =>{
        let tmplist = []
        let length = NFTLists?.length;


        for (let i = 0; i < length; i++) {
            if (selectedId[i]) tmplist.push(NFTLists[i]);
        }
       
        if(tmplist.length == 0 ){
            toast.error("Please select items")
            return;
        }
        setNFTitem(tmplist); 
        setIsList(true);
        setSelectedId([])
    }

    useEffect(() => {
        const timeout = setInterval(() => {
            getAssetByAlgoAddress();
        }, 3000);
        return () => clearInterval(timeout);
    }, [])

    return (
        <>
                  {  isLoading&&<SpinnerLoader style = {{justifyContent:'start',marginTop:100}} />}

            <PriceListContainer>

                <h1>Platform Assets</h1>
                <br />
                <div style={{float:'right'}}>
                    <span style={{position:'absolute', right:'120px', marginTop:'5px'}}>Multi List</span>
                    <MultiSwitch
                        checked={isMultiImport}
                        onChange={handleChange}
                    />
                </div>
                <br />
                {
                    NFTLists.length > 0 ?
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>NFT</th>
                                    <th>Unitname</th>
                                    {/* <th>Amount</th> */}
                                    {
                                        !isMultiImport &&
                                        <th>Action</th>
                                    }
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    NFTLists.map((item, i) => {
                                        return (
                                            <tr key={i} onClick={() => clickItem(i)} className={selectedId[i] && isMultiImport && "selected"}>
                                                <td style={{ width: '300px' }}>
                                                    <div style={{ display: 'flex' }}>
                                                        <div className="nft-info__img">
                                                            <img src={checkIfImageExists(item.url) ? item.url : "https://toppng.com/uploads/preview/ending-stamp-png-under-review-transparent-11563041686amepvm3pcu.png"} alt="NFT Img" style={{ height: '100px', width: '100px', objectFit: 'cover', border: '2px solid #ccc' }} />
                                                        </div>
                                                        <div style={{ marginLeft: '10px', alignSelf: 'center' }}>
                                                            <h4 style={{ marginBottom: '0px' }}>{item?.name}</h4>
                                                            <p style={{ color: '#6c757d', display: 'contents', cursor: 'pointer' }} >ID {item?.id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <h4 className="mb-0">{item?.unit_name}</h4>
                                                </td>
                                                {/* <td style={{ textAlign: 'center' }}>
                                                    <h4 className="mb-0">{item?.amount}</h4>
                                                </td> */}
                                                <td style={{ textAlign: "-webkit-center", verticalAlign: "-webkit-baseline-middle" }}>
                                                    {
                                                        !isMultiImport &&
                                                        <Button onClick={() => { setNFTitem(item); ; setIsList(true);console.log(item.length, "type-tmplist") }}>List</Button>
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        : <div style={{ textAlign: 'center', width: '100%' }}><img src={NoResultImg} alt="Sorry No Results donatelo212dunccine@gmail.com" /></div>
                }
                {
                    isMultiImport &&
                    <div style={{textAlign:'-webkit-center'}}>
                        <Button onClick={handlemultiList}>List</Button>
                    </div>
                }
            </PriceListContainer>
            <Modal
                width='370px'
                open={isList}
                onClose={() => setIsList(false)}
            >
                <ListDialog onClose={() => setIsList(false)} item={NFTitem} />
            </Modal>
        </>
    )
}